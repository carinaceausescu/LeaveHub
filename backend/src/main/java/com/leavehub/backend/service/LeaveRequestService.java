package com.leavehub.backend.service;

import com.leavehub.backend.model.Employee;
import com.leavehub.backend.model.LeaveApprovalResult;
import com.leavehub.backend.model.LeaveRequest;
import com.leavehub.backend.model.LeaveWorkflow;
import com.leavehub.backend.repository.AttachmentRepository;
import com.leavehub.backend.repository.EmployeeRepository;
import com.leavehub.backend.repository.LeaveRequestRepository;
import com.leavehub.backend.repository.LeaveWorkflowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class LeaveRequestService {

    @Autowired
    private HolidayService holidayService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private LeaveWorkflowRepository leaveWorkflowRepository;

    @Autowired
    private AttachmentRepository attachmentRepository;

    public LeaveRequest createRequest(LeaveRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("Data de sfarsit nu poate fi inainte de data de inceput");
        }

        int workingDays = holidayService.calculateWorkingDays(request.getStartDate(), request.getEndDate());
        request.setWorkingDays(workingDays);
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDate.now());

        LeaveRequest saved = leaveRequestRepository.save(request);
        logWorkflowChange(saved, null, "PENDING", null);
        return saved;
    }

    public LeaveApprovalResult changeStatus(Integer requestId, String newStatus, String comment) {
        LeaveRequest request = leaveRequestRepository.findById(requestId).orElseThrow();
        String oldStatus = request.getStatus();

        if ("CANCELLED".equals(newStatus) && "APPROVED".equals(oldStatus)) {
            throw new IllegalArgumentException("Nu poti anula o cerere care a fost deja aprobata");
        }

        if ("REJECTED".equals(newStatus) && (comment == null || comment.isBlank())) {
            throw new IllegalArgumentException("Comentariul este obligatoriu la respingerea unei cereri");
        }

        String warning = null;
        boolean isCO = "CO".equals(request.getLeaveType().getCode());

        if ("APPROVED".equals(newStatus)) {
            boolean requiresAttachment = Boolean.TRUE.equals(request.getLeaveType().getRequiresAttachment());
            if (requiresAttachment) {
                boolean hasAttachment = !attachmentRepository
                        .findByLeaveRequest_LeaveRequestId(requestId)
                        .isEmpty();
                if (!hasAttachment) {
                    throw new IllegalArgumentException(
                            "Acest tip de concediu necesita un document atasat inainte de aprobare");
                }
            }

            if (isCO) {
                Employee employeeToCheck = request.getEmployee();
                if (employeeToCheck.getAvailableLeaveDays() < request.getWorkingDays()) {
                    throw new IllegalArgumentException(
                            "Angajatul nu are suficiente zile de concediu disponibile. Zile disponibile: " +
                                    employeeToCheck.getAvailableLeaveDays() + ", zile solicitate: " + request.getWorkingDays());
                }
            }

            Integer departmentId = request.getEmployee().getDepartment().getDeptId();
            Integer maxAbsent = request.getEmployee().getDepartment().getMaxAbsentEmployees();

            long overlapping = leaveRequestRepository.countOverlappingApproved(
                    departmentId, request.getStartDate(), request.getEndDate(), requestId);

            long totalAbsent = overlapping + 1;

            if (maxAbsent != null && totalAbsent > maxAbsent) {
                warning = "Atentie: numarul maxim de angajati absenti simultan (" + maxAbsent +
                        ") este depasit in aceasta perioada. Angajati absenti: " + totalAbsent;
            }
        }

        request.setStatus(newStatus);
        LeaveRequest updated = leaveRequestRepository.save(request);

        if ("APPROVED".equals(newStatus) && isCO) {
            Employee employee = updated.getEmployee();
            int remaining = employee.getAvailableLeaveDays() - updated.getWorkingDays();
            employee.setAvailableLeaveDays(remaining);
            employeeRepository.save(employee);
        }

        logWorkflowChange(updated, oldStatus, newStatus, comment);

        return new LeaveApprovalResult(updated, warning);
    }

    private void logWorkflowChange(LeaveRequest request, String oldStatus, String newStatus, String comment) {
        LeaveWorkflow workflow = new LeaveWorkflow();
        workflow.setLeaveRequest(request);
        workflow.setEmployee(request.getEmployee());
        workflow.setOldStatus(oldStatus);
        workflow.setCurrentStatus(newStatus);
        workflow.setComment(comment);
        workflow.setChangedAt(LocalDateTime.now());
        leaveWorkflowRepository.save(workflow);
    }


}