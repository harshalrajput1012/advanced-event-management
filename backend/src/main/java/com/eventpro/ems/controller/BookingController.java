package com.eventpro.ems.controller;

import com.eventpro.ems.dto.OrganizerDashboardResponse;
import com.eventpro.ems.dto.booking.BookingRequest;
import com.eventpro.ems.dto.booking.BookingResponse;
import com.eventpro.ems.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public BookingResponse create(@Valid @RequestBody BookingRequest request) {
        return bookingService.create(request);
    }

    @GetMapping("/mine")
    public Page<BookingResponse> mine(Pageable pageable) {
        return bookingService.mine(pageable);
    }

    @PatchMapping("/{id}/cancel")
    public BookingResponse cancel(@PathVariable Long id) {
        return bookingService.cancel(id);
    }

    @GetMapping("/organizer")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public Page<BookingResponse> organizerBookings(Pageable pageable) {
        return bookingService.organizerBookings(pageable);
    }

    @GetMapping("/organizer/dashboard")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public OrganizerDashboardResponse organizerDashboard() {
        return bookingService.organizerDashboard();
    }
}
