package com.leavehub.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "leave_request")
@Getter
@Setter
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer leaveRequestId;

    @ManyToOne
    @JoinColumn(name = "empl_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "leave_type_id")
    private LeaveType leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer workingDays;
    private String status;
    private LocalDate createdAt;
}