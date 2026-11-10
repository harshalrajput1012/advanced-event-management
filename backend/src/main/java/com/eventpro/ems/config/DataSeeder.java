package com.eventpro.ems.config;

import com.eventpro.ems.model.Role;
import com.eventpro.ems.model.User;
import com.eventpro.ems.model.UserStatus;
import com.eventpro.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedAdmin(@Value("${ADMIN_EMAIL:admin@eventpro.local}") String adminEmail,
                                @Value("${ADMIN_PASSWORD:Admin@12345}") String adminPassword,
                                @Value("${ORGANIZER_EMAIL:organizer@eventpro.local}") String organizerEmail,
                                @Value("${ORGANIZER_PASSWORD:Organizer@123}") String organizerPassword,
                                @Value("${USER_EMAIL:user@eventpro.local}") String userEmail,
                                @Value("${USER_PASSWORD:User@12345}") String userPassword) {
        return args -> {
            seedUser("System Admin", adminEmail, adminPassword, Role.ADMIN);
            seedUser("Demo Organizer", organizerEmail, organizerPassword, Role.ORGANIZER);
            seedUser("Demo User", userEmail, userPassword, Role.USER);
        };
    }

    private void seedUser(String name, String email, String password, Role role) {
        userRepository.findByEmail(email).orElseGet(() -> userRepository.save(User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .status(UserStatus.ACTIVE)
                .build()));
    }
}
