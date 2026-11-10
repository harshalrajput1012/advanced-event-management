package com.eventpro.ems.dto.auth;

import com.eventpro.ems.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @Size(min = 8, message = "Password must contain at least 8 characters") String password,
        Role role
) {
}
