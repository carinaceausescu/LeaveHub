package com.leavehub.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_workflow")
@Getter
@Setter
public class LeaveWorkflow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer workflowId;

    @ManyToOne
    @JoinColumn(name = "leave_request_id")
    private LeaveRequest leaveRequest;

    @ManyToOne
    @JoinColumn(name = "empl_id")
    private Employee employee;
    private String oldStatus;
    private String currentStatus;
    private String comment;
    private LocalDateTime changedAt;
}