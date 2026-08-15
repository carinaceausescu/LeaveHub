package com.leavehub.backend.dto;

import com.leavehub.backend.model.Employee;

public record LoginResponse(
        Integer emplId,
        String name,
        String email,
        String role,
        Integer departmentId,
        String departmentName,
        Integer annualLeaveDays,
        Integer availableLeaveDays
) {

    public static LoginResponse from(Employee employee) {
        return new LoginResponse(
                employee.getEmplId(),
                employee.getName(),
                employee.getEmail(),
                employee.getRole(),
                employee.getDepartment() != null ? employee.getDepartment().getDeptId() : null,
                employee.getDepartment() != null ? employee.getDepartment().getDepartmentName() : null,
                employee.getAnnualLeaveDays(),
                employee.getAvailableLeaveDays()
        );
    }
}
