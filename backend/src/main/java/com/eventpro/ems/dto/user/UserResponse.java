package com.eventpro.ems.dto.user;

import com.eventpro.ems.model.Role;
import com.eventpro.ems.model.UserStatus;

public record UserResponse(Long id, String name, String email, Role role, UserStatus status) {
}
