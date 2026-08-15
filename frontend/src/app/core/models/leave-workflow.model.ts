import { Employee } from './employee.model';
import { LeaveRequest } from './leave-request.model';

export interface LeaveWorkflow {
    workflowId: number;
    leaveRequest: LeaveRequest;
    employee: Employee;
    oldStatus: string | null;
    currentStatus: string;
    comment: string | null;
    changedAt: string;
}