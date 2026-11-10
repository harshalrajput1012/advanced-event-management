package com.eventpro.ems.service;

import com.eventpro.ems.dto.OrganizerDashboardResponse;
import com.eventpro.ems.dto.booking.BookingRequest;
import com.eventpro.ems.dto.booking.BookingResponse;
import com.eventpro.ems.exception.ApiException;
import com.eventpro.ems.model.*;
import com.eventpro.ems.repository.BookingRepository;
import com.eventpro.ems.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final CurrentUserService currentUserService;
    private final MapperService mapper;

    @Transactional
    public BookingResponse create(BookingRequest request) {
        User user = currentUserService.get();
        Event event = eventRepository.findLockedById(request.eventId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found"));
        if (event.getStatus() != EventStatus.APPROVED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Event is not approved for booking");
        }
        if (event.getDateTime().isBefore(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cannot book a past event");
        }
        if (event.getAvailableSeats() < request.ticketCount()) {
            throw new ApiException(HttpStatus.CONFLICT, "Not enough seats available");
        }
        event.setAvailableSeats(event.getAvailableSeats() - request.ticketCount());
        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .ticketCount(request.ticketCount())
                .totalPrice(event.getPrice().multiply(java.math.BigDecimal.valueOf(request.ticketCount())))
                .status(BookingStatus.PENDING_PAYMENT)
                .build();
        return mapper.booking(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> mine(Pageable pageable) {
        return bookingRepository.findByUserId(currentUserService.get().getId(), pageable).map(mapper::booking);
    }

    @Transactional
    public BookingResponse cancel(Long id) {
        User user = currentUserService.get();
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found"));
        boolean owner = booking.getUser().getId().equals(user.getId());
        boolean eventOwner = booking.getEvent().getOrganizer().getId().equals(user.getId());
        if (!owner && !eventOwner && user.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You cannot cancel this booking");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            return mapper.booking(booking);
        }
        if (booking.getEvent().getDateTime().minusHours(24).isBefore(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Bookings can only be cancelled at least 24 hours before the event");
        }
        if (booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.PENDING_PAYMENT) {
            booking.getEvent().setAvailableSeats(booking.getEvent().getAvailableSeats() + booking.getTicketCount());
        }
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(java.time.Instant.now());
        return mapper.booking(booking);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> organizerBookings(Pageable pageable) {
        return bookingRepository.findForOrganizer(currentUserService.get().getId(), pageable).map(mapper::booking);
    }

    @Transactional(readOnly = true)
    public OrganizerDashboardResponse organizerDashboard() {
        Long id = currentUserService.get().getId();
        return new OrganizerDashboardResponse(bookingRepository.confirmedBookingsForOrganizer(id), bookingRepository.revenueForOrganizer(id));
    }
}
