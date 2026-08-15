package com.leavehub.backend.repository;

import com.leavehub.backend.model.LeaveWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveWorkflowRepository extends JpaRepository<LeaveWorkflow, Integer> {

    List<LeaveWorkflow> findByLeaveRequest_LeaveRequestIdOrderByChangedAtAsc(Integer leaveRequestId);
}
