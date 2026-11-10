package com.eventpro.ems.controller;

import com.eventpro.ems.dto.user.CreateOrganizerRequest;
import com.eventpro.ems.dto.user.UserResponse;
import com.eventpro.ems.model.Role;
import com.eventpro.ems.model.UserStatus;
import com.eventpro.ems.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/users")
    public Page<UserResponse> users(@RequestParam(required = false) Role role, Pageable pageable) {
        return adminService.users(role, pageable);
    }

    @PatchMapping("/users/{id}/status")
    public UserResponse status(@PathVariable Long id, @RequestParam UserStatus status) {
        return adminService.status(id, status);
    }

    @PostMapping("/organizers")
    public UserResponse createOrganizer(@Valid @RequestBody CreateOrganizerRequest request) {
        return adminService.createOrganizer(request);
    }
}
