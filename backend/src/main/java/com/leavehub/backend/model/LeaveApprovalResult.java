package com.leavehub.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveApprovalResult {
    private LeaveRequest leaveRequest;
    private String warning;

    public LeaveApprovalResult(LeaveRequest leaveRequest, String warning) {
        this.leaveRequest = leaveRequest;
        this.warning = warning;
    }
}