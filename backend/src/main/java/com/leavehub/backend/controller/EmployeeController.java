package com.leavehub.backend.controller;

import com.leavehub.backend.model.Employee;
import com.leavehub.backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Employee getById(@PathVariable Integer id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Employee create(@RequestBody Employee employee) {
        if (employee.getPassword() != null && !employee.getPassword().isBlank()) {
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        }
        return employeeRepository.save(employee);
    }

    @PutMapping("/{id}")
    public Employee update(@PathVariable Integer id, @RequestBody Employee updated) {
        Employee existing = employeeRepository.findById(id).orElseThrow();
        updated.setEmplId(id);
        if (updated.getPassword() == null || updated.getPassword().isBlank()) {
            updated.setPassword(existing.getPassword());
        }
        return employeeRepository.save(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        employeeRepository.deleteById(id);
    }
}