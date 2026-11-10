package com.eventpro.ems.dto.booking;

import com.eventpro.ems.dto.event.EventResponse;
import com.eventpro.ems.dto.user.UserResponse;
import com.eventpro.ems.model.BookingStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record BookingResponse(
        Long id,
        UserResponse user,
        EventResponse event,
        Integer ticketCount,
        BigDecimal totalPrice,
        BookingStatus status,
        Instant createdAt
) {
}
