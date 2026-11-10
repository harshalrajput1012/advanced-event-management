package com.eventpro.ems.service;

import com.eventpro.ems.dto.user.CreateOrganizerRequest;
import com.eventpro.ems.dto.user.UserResponse;
import com.eventpro.ems.exception.ApiException;
import com.eventpro.ems.model.Role;
import com.eventpro.ems.model.User;
import com.eventpro.ems.model.UserStatus;
import com.eventpro.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final MapperService mapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<UserResponse> users(Role role, Pageable pageable) {
        return role == null ? userRepository.findAll(pageable).map(mapper::user) : userRepository.findByRole(role, pageable).map(mapper::user);
    }

    @Transactional
    public UserResponse status(Long id, UserStatus status) {
        User user = userRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        user.setStatus(status);
        return mapper.user(user);
    }

    @Transactional
    public UserResponse createOrganizer(CreateOrganizerRequest request) {
        String email = request.email().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email is already registered");
        }
        User organizer = User.builder()
                .name(request.name())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ORGANIZER)
                .status(UserStatus.ACTIVE)
                .build();
        return mapper.user(userRepository.save(organizer));
    }
}
