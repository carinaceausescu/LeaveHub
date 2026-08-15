package com.leavehub.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "leave_type")
@Getter
@Setter
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer leaveTypeId;

    private String name;

    private String code;

    private Boolean requiresAttachment;

    private Boolean paid;
}