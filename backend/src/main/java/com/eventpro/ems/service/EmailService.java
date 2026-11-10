package com.eventpro.ems.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {
    public void sendBookingConfirmation(String email, String eventTitle) {
        log.info("Simulated email: booking confirmation sent to {} for {}", email, eventTitle);
    }
}
