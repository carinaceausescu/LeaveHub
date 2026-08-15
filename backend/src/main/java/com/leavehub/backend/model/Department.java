package com.leavehub.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "department")
@Getter
@Setter
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer deptId;

    private String departmentName;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    @JsonIgnoreProperties({"department"})
    private Employee manager;

    private Integer maxAbsentEmployees;
}
