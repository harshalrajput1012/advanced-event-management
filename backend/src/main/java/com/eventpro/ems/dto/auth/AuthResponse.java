package com.eventpro.ems.dto.auth;

import com.eventpro.ems.dto.user.UserResponse;

public record AuthResponse(String token, UserResponse user) {
}
