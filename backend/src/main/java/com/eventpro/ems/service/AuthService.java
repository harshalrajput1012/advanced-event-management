package com.eventpro.ems.service;

import com.eventpro.ems.dto.auth.AuthResponse;
import com.eventpro.ems.dto.auth.LoginRequest;
import com.eventpro.ems.dto.auth.RegisterRequest;
import com.eventpro.ems.exception.ApiException;
import com.eventpro.ems.model.Role;
import com.eventpro.ems.model.User;
import com.eventpro.ems.model.UserStatus;
import com.eventpro.ems.repository.UserRepository;
import com.eventpro.ems.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final MapperService mapper;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "Email is already registered");
        }
        if (request.role() != null && request.role() != Role.USER) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Public registration is available for users only");
        }
        User user = User.builder()
                .name(request.name())
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(user), mapper.user(user));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password()));
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Account is blocked");
        }
        return new AuthResponse(jwtService.generateToken(user), mapper.user(user));
    }
}
