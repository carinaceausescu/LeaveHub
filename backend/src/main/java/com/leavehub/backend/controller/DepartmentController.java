package com.leavehub.backend.controller;

import com.leavehub.backend.model.Department;
import com.leavehub.backend.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:4200")
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping
    public List<Department> getAll() {
        return departmentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Department getById(@PathVariable Integer id) {
        return departmentRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Department create(@RequestBody Department department) {
        return departmentRepository.save(department);
    }

    @PutMapping("/{id}")
    public Department update(@PathVariable Integer id, @RequestBody Department updated) {
        updated.setDeptId(id);
        return departmentRepository.save(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        departmentRepository.deleteById(id);
    }
}