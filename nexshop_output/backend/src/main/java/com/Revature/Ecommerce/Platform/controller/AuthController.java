package com.Revature.Ecommerce.Platform.controller;

import com.Revature.Ecommerce.Platform.dto.ApiResponse;
import com.Revature.Ecommerce.Platform.dto.AuthRequest;
import com.Revature.Ecommerce.Platform.models.User;
import com.Revature.Ecommerce.Platform.security.JwtUtil;
import com.Revature.Ecommerce.Platform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User saved = userService.register(user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Registration successful", null));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userService.login(request.getEmail(), request.getPassword());
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", token));
    }
}
