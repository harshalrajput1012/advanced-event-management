package com.eventpro.ems.dto.payment;

import jakarta.validation.constraints.NotNull;

public record PaymentRequest(@NotNull Long bookingId, boolean forceFailure) {
}
