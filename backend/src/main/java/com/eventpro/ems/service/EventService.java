package com.eventpro.ems.service;

import com.eventpro.ems.dto.event.EventRequest;
import com.eventpro.ems.dto.event.EventResponse;
import com.eventpro.ems.exception.ApiException;
import com.eventpro.ems.model.*;
import com.eventpro.ems.repository.BookingRepository;
import com.eventpro.ems.repository.EventRepository;
import com.eventpro.ems.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final CurrentUserService currentUserService;
    private final MapperService mapper;

    @Transactional(readOnly = true)
    public Page<EventResponse> search(EventStatus status, EventCategory category, String location, String search,
                                      LocalDateTime fromDate, LocalDateTime toDate, Boolean freeOnly,
                                      BigDecimal maxPrice, Pageable pageable) {
        if (status != null && status != EventStatus.APPROVED && !hasRole(Role.ADMIN)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only admins can query non-approved events");
        }
        EventStatus effectiveStatus = status == null ? EventStatus.APPROVED : status;
        return eventRepository.search(effectiveStatus, null, category, location, search, fromDate, toDate, freeOnly, maxPrice, pageable).map(mapper::event);
    }

    @Transactional(readOnly = true)
    public EventResponse get(Long id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found"));
        if (event.getStatus() != EventStatus.APPROVED && !canManage(event)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Event is not publicly available");
        }
        return mapper.event(event);
    }

    @Transactional
    public EventResponse create(EventRequest request) {
        User organizer = currentUserService.get();
        EventStatus initialStatus = organizer.getRole() == Role.ADMIN ? EventStatus.APPROVED : EventStatus.PENDING;
        Event event = Event.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .location(request.location())
                .dateTime(request.dateTime())
                .capacity(request.capacity())
                .availableSeats(request.capacity())
                .price(request.price())
                .organizer(organizer)
                .imageUrl(request.imageUrl())
                .status(initialStatus)
                .build();
        return mapper.event(eventRepository.save(event));
    }

    @Transactional
    public EventResponse update(Long id, EventRequest request) {
        User organizer = currentUserService.get();
        Event event = eventRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found"));
        if (!event.getOrganizer().getId().equals(organizer.getId()) && organizer.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the organizer can update this event");
        }
        int sold = event.getCapacity() - event.getAvailableSeats();
        if (request.capacity() < sold) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Capacity cannot be lower than sold tickets");
        }
        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setCategory(request.category());
        event.setLocation(request.location());
        event.setDateTime(request.dateTime());
        event.setCapacity(request.capacity());
        event.setAvailableSeats(request.capacity() - sold);
        event.setPrice(request.price());
        event.setImageUrl(request.imageUrl());
        if (organizer.getRole() != Role.ADMIN) {
            event.setStatus(EventStatus.PENDING);
        }
        return mapper.event(event);
    }

    @Transactional
    public void delete(Long id) {
        User organizer = currentUserService.get();
        Event event = eventRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found"));
        if (!event.getOrganizer().getId().equals(organizer.getId()) && organizer.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the organizer can delete this event");
        }
        paymentRepository.deleteByEventId(id);
        bookingRepository.deleteByEventId(id);
        eventRepository.delete(event);
    }

    @Transactional(readOnly = true)
    public Page<EventResponse> organizerEvents(Pageable pageable) {
        User organizer = currentUserService.get();
        return eventRepository.search(null, organizer.getId(), null, null, null, null, null, null, null, pageable).map(mapper::event);
    }

    @Transactional
    public EventResponse moderate(Long id, EventStatus status) {
        if (status == EventStatus.PENDING) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Moderation must approve or reject");
        }
        Event event = eventRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found"));
        event.setStatus(status);
        return mapper.event(event);
    }

    public String saveImage(MultipartFile file, String uploadDir) {
        if (file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Image file is empty");
        }
        try {
            Files.createDirectories(Path.of(uploadDir));
            String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path path = Path.of(uploadDir, filename);
            file.transferTo(path);
            return "/uploads/" + filename;
        } catch (IOException ex) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not upload image");
        }
    }

    private boolean canManage(Event event) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return false;
        }
        User user = currentUserService.get();
        return user.getRole() == Role.ADMIN || event.getOrganizer().getId().equals(user.getId());
    }

    private boolean hasRole(Role role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role.name()));
    }
}
