package com.leavehub.backend.controller;

import com.leavehub.backend.model.LeaveRequest;
import com.leavehub.backend.repository.LeaveRequestRepository;
import com.leavehub.backend.model.LeaveApprovalResult;
import com.leavehub.backend.service.LeaveRequestService;
import com.leavehub.backend.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave-requests")
@CrossOrigin(origins = "http://localhost:4200")
public class LeaveRequestController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private LeaveRequestService leaveRequestService;

    @GetMapping
    public List<LeaveRequest> getAll() {
        return leaveRequestRepository.findAll();
    }

    @GetMapping("/{id}")
    public LeaveRequest getById(@PathVariable Integer id) {
        return leaveRequestRepository.findById(id).orElse(null);
    }

    @GetMapping("/search")
    public List<LeaveRequest> search(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Integer leaveTypeId,
            @RequestParam(required = false) Integer employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return leaveRequestRepository.search(status, departmentId, leaveTypeId, employeeId, startDate, endDate);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Integer id) {
        LeaveRequest request = leaveRequestRepository.findById(id).orElse(null);
        if (request == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdfBytes = pdfService.generateLeaveRequestPdf(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=cerere_concediu_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @PostMapping
    public LeaveRequest create(@RequestBody LeaveRequest request) {
        return leaveRequestService.createRequest(request);
    }

    @PutMapping("/{id}/status")
    public LeaveApprovalResult updateStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        return leaveRequestService.changeStatus(id, body.get("status"), body.get("comment"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        leaveRequestRepository.deleteById(id);
    }
}