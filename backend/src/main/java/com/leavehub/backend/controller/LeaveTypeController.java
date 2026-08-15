package com.leavehub.backend.controller;

import com.leavehub.backend.model.LeaveType;
import com.leavehub.backend.repository.LeaveTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-types")
@CrossOrigin(origins = "http://localhost:4200")
public class LeaveTypeController {

    @Autowired
    private LeaveTypeRepository leaveTypeRepository;

    @GetMapping
    public List<LeaveType> getAll() {
        return leaveTypeRepository.findAll();
    }

    @GetMapping("/{id}")
    public LeaveType getById(@PathVariable Integer id) {
        return leaveTypeRepository.findById(id).orElse(null);
    }

    @PostMapping
    public LeaveType create(@RequestBody LeaveType leaveType) {
        return leaveTypeRepository.save(leaveType);
    }

    @PutMapping("/{id}")
    public LeaveType update(@PathVariable Integer id, @RequestBody LeaveType updated) {
        updated.setLeaveTypeId(id);
        return leaveTypeRepository.save(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        leaveTypeRepository.deleteById(id);
    }
}