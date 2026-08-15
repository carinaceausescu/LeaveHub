package com.leavehub.backend.repository;

import com.leavehub.backend.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Integer> {
    List<Attachment> findByLeaveRequest_LeaveRequestId(Integer leaveRequestId);
}