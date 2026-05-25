package com.movieticket.config;

import com.movieticket.entity.User;
import com.movieticket.enums.Role;
import com.movieticket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@movieticket.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@movieticket.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("0123456789")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@movieticket.com / admin123");
        }
    }
}
