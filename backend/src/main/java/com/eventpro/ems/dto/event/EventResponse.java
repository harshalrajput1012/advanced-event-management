package com.eventpro.ems.dto.event;

import com.eventpro.ems.dto.user.UserResponse;
import com.eventpro.ems.model.EventCategory;
import com.eventpro.ems.model.EventStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        String title,
        String description,
        EventCategory category,
        String location,
        LocalDateTime dateTime,
        Integer capacity,
        Integer availableSeats,
        BigDecimal price,
        UserResponse organizer,
        String imageUrl,
        EventStatus status
) {
}
