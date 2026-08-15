package com.leavehub.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusChangeRequest {
    private String status;
    private String comment;
    private Integer changedBy;
}
