package com.leavehub.backend.repository;

import com.leavehub.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    Optional<Employee> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<Employee> findByDepartment_DeptIdOrderByNameAsc(Integer departmentId);

    List<Employee> findByPasswordIsNull();
}
