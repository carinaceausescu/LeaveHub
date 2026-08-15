package com.leavehub.backend.service;

import com.leavehub.backend.dto.LoginRequest;
import com.leavehub.backend.dto.LoginResponse;
import com.leavehub.backend.model.Employee;
import com.leavehub.backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest credentials) {
        if (credentials.getEmail() == null || credentials.getEmail().isBlank()
                || credentials.getPassword() == null || credentials.getPassword().isBlank()) {
            throw new IllegalArgumentException("Emailul si parola sunt obligatorii");
        }

        Employee employee = employeeRepository
                .findByEmailIgnoreCase(credentials.getEmail().trim())
                .orElseThrow(() -> new IllegalArgumentException("Email sau parola incorecte"));

        if (employee.getPassword() == null
                || !passwordEncoder.matches(credentials.getPassword(), employee.getPassword())) {
            throw new IllegalArgumentException("Email sau parola incorecte");
        }

        return LoginResponse.from(employee);
    }
}
