import { Employee } from './employee.model';

export interface LeaveType {
    leaveTypeId: number;
    name: string;
    code: string;
    requiresAttachment: boolean;
    paid: boolean;
}

export interface LeaveRequest {
    leaveRequestId: number;
    employee: Employee;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    workingDays: number;
    status: string;
    createdAt: string;
}

export interface LeaveApprovalResult {
    leaveRequest: LeaveRequest;
    warning: string | null;
}