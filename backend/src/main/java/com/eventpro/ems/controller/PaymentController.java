package com.eventpro.ems.controller;

import com.eventpro.ems.dto.payment.PaymentRequest;
import com.eventpro.ems.dto.payment.PaymentResponse;
import com.eventpro.ems.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/simulate")
    public PaymentResponse simulate(@Valid @RequestBody PaymentRequest request) {
        return paymentService.pay(request);
    }
}
