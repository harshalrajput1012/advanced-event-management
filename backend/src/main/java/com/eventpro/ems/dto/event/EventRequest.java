package com.eventpro.ems.dto.event;

import com.eventpro.ems.model.EventCategory;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EventRequest(
        @NotBlank String title,
        @NotBlank @Size(max = 5000) String description,
        @NotNull EventCategory category,
        @NotBlank String location,
        @Future LocalDateTime dateTime,
        @Min(1) Integer capacity,
        @DecimalMin("0.00") BigDecimal price,
        String imageUrl
) {
}
