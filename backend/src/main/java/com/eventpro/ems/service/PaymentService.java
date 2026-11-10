package com.eventpro.ems.service;

import com.eventpro.ems.dto.payment.PaymentRequest;
import com.eventpro.ems.dto.payment.PaymentResponse;
import com.eventpro.ems.exception.ApiException;
import com.eventpro.ems.model.*;
import com.eventpro.ems.repository.BookingRepository;
import com.eventpro.ems.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final CurrentUserService currentUserService;
    private final MapperService mapper;
    private final EmailService emailService;

    @Transactional
    public PaymentResponse pay(PaymentRequest request) {
        User user = currentUserService.get();
        Booking booking = bookingRepository.findById(request.bookingId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Cannot pay for another user's booking");
        }
        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Booking is not awaiting payment");
        }
        PaymentStatus status = request.forceFailure() ? PaymentStatus.FAILED : PaymentStatus.SUCCESS;
        booking.setStatus(status == PaymentStatus.SUCCESS ? BookingStatus.CONFIRMED : BookingStatus.PAYMENT_FAILED);
        if (status == PaymentStatus.FAILED) {
            booking.getEvent().setAvailableSeats(booking.getEvent().getAvailableSeats() + booking.getTicketCount());
        }
        Payment payment = paymentRepository.save(Payment.builder()
                .booking(booking)
                .amount(booking.getTotalPrice())
                .status(status)
                .build());
        if (status == PaymentStatus.SUCCESS) {
            emailService.sendBookingConfirmation(user.getEmail(), booking.getEvent().getTitle());
        }
        return mapper.payment(payment);
    }
}
