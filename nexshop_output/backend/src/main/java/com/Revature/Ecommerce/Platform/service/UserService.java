package com.Revature.Ecommerce.Platform.service;

import com.Revature.Ecommerce.Platform.models.User;
import com.Revature.Ecommerce.Platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Normalize role: store WITHOUT ROLE_ prefix (e.g. CUSTOMER, SELLER, ADMIN)
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        } else {
            // Remove ROLE_ prefix if frontend sends it
            String role = user.getRole().toUpperCase();
            if (role.startsWith("ROLE_")) {
                role = role.substring(5);
            }
            user.setRole(role);
        }

        return userRepository.save(user);
    }

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}
