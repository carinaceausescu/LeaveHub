package com.leavehub.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "attachment")
@Getter
@Setter
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer attachmentId;

    @ManyToOne
    @JoinColumn(name = "leave_request_id")
    private LeaveRequest leaveRequest;
    private String fileName;
    private String filePath;
    private LocalDateTime uploadedAt;
}