package com.eventpro.ems.dto.payment;

import com.eventpro.ems.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record PaymentResponse(Long id, Long bookingId, BigDecimal amount, PaymentStatus status, Instant paymentDate) {
}
