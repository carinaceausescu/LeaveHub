package com.leavehub.backend.controller;

import com.leavehub.backend.model.Employee;
import com.leavehub.backend.model.LeaveRequest;
import com.leavehub.backend.repository.EmployeeRepository;
import com.leavehub.backend.repository.LeaveRequestRepository;
import com.leavehub.backend.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PdfService pdfService;

    @GetMapping("/pending-requests/pdf")
    public ResponseEntity<byte[]> pendingRequestsReport() {
        List<LeaveRequest> pending = leaveRequestRepository.findAll().stream()
                .filter(r -> "PENDING".equals(r.getStatus()))
                .collect(Collectors.toList());

        return buildResponse(pdfService.generatePendingRequestsReport(pending), "cereri_in_asteptare.pdf");
    }

    @GetMapping("/department-balance/pdf")
    public ResponseEntity<byte[]> departmentBalanceReport() {
        List<Employee> employees = employeeRepository.findAll();
        return buildResponse(pdfService.generateDepartmentBalanceReport(employees), "sold_per_departament.pdf");
    }

    @GetMapping("/leave-usage/pdf")
    public ResponseEntity<byte[]> leaveUsageReport() {
        List<LeaveRequest> approved = leaveRequestRepository.findAll().stream()
                .filter(r -> "APPROVED".equals(r.getStatus()))
                .collect(Collectors.toList());

        return buildResponse(pdfService.generateLeaveUsageReport(approved), "utilizare_concedii.pdf");
    }

    private ResponseEntity<byte[]> buildResponse(byte[] pdf, String filename) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}