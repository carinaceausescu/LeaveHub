package com.leavehub.backend.controller;

import com.leavehub.backend.model.LeaveWorkflow;
import com.leavehub.backend.repository.LeaveWorkflowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-workflows")
@CrossOrigin(origins = "http://localhost:4200")
public class LeaveWorkflowController {

    @Autowired
    private LeaveWorkflowRepository leaveWorkflowRepository;

    @GetMapping
    public List<LeaveWorkflow> getAll() {
        return leaveWorkflowRepository.findAll();
    }

    @GetMapping("/{id}")
    public LeaveWorkflow getById(@PathVariable Integer id) {
        return leaveWorkflowRepository.findById(id).orElse(null);
    }
}