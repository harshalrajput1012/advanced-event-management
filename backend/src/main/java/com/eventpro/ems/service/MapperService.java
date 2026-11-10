package com.eventpro.ems.service;

import com.eventpro.ems.dto.booking.BookingResponse;
import com.eventpro.ems.dto.event.EventResponse;
import com.eventpro.ems.dto.payment.PaymentResponse;
import com.eventpro.ems.dto.user.UserResponse;
import com.eventpro.ems.model.Booking;
import com.eventpro.ems.model.Event;
import com.eventpro.ems.model.Payment;
import com.eventpro.ems.model.User;
import org.springframework.stereotype.Service;

@Service
public class MapperService {
    public UserResponse user(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getStatus());
    }

    public EventResponse event(Event event) {
        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getCategory(),
                event.getLocation(),
                event.getDateTime(),
                event.getCapacity(),
                event.getAvailableSeats(),
                event.getPrice(),
                user(event.getOrganizer()),
                event.getImageUrl(),
                event.getStatus());
    }

    public BookingResponse booking(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                user(booking.getUser()),
                event(booking.getEvent()),
                booking.getTicketCount(),
                booking.getTotalPrice(),
                booking.getStatus(),
                booking.getCreatedAt());
    }

    public PaymentResponse payment(Payment payment) {
        return new PaymentResponse(payment.getId(), payment.getBooking().getId(), payment.getAmount(), payment.getStatus(), payment.getPaymentDate());
    }
}
