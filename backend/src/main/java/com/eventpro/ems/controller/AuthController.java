package com.eventpro.ems.controller;

import com.eventpro.ems.dto.auth.AuthResponse;
import com.eventpro.ems.dto.auth.LoginRequest;
import com.eventpro.ems.dto.auth.RegisterRequest;
import com.eventpro.ems.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
