package com.leavehub.backend.repository;

import com.leavehub.backend.model.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveTypeRepository extends JpaRepository<LeaveType, Integer> {
}