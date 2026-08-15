package com.leavehub.backend.controller;

import com.leavehub.backend.dto.LoginRequest;
import com.leavehub.backend.dto.LoginResponse;
import com.leavehub.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest credentials) {
        return authService.login(credentials);
    }
}
