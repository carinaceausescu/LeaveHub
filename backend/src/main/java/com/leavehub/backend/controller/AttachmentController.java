package com.leavehub.backend.controller;

import com.leavehub.backend.model.Attachment;
import com.leavehub.backend.model.LeaveRequest;
import com.leavehub.backend.repository.AttachmentRepository;
import com.leavehub.backend.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.nio.file.Files;

@RestController
@RequestMapping("/api/attachments")
@CrossOrigin(origins = "http://localhost:4200")
public class AttachmentController {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    private final String uploadDir = System.getProperty("user.home") + "/leave-hub-uploads/";

    @GetMapping
    public List<Attachment> getAll() {
        return attachmentRepository.findAll();
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Integer id) throws IOException {
        Attachment attachment = attachmentRepository.findById(id).orElseThrow();
        byte[] fileBytes = Files.readAllBytes(Path.of(attachment.getFilePath()));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + attachment.getFileName())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileBytes);
    }

    @PostMapping
    public Attachment upload(@RequestParam("file") MultipartFile file,
                             @RequestParam("leaveRequestId") Integer leaveRequestId) throws IOException {

        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveRequestId).orElseThrow();

        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String uniqueName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Path.of(uploadDir + uniqueName);
        Files.write(filePath, file.getBytes());

        Attachment attachment = new Attachment();
        attachment.setLeaveRequest(leaveRequest);
        attachment.setFileName(file.getOriginalFilename());
        attachment.setFilePath(filePath.toString());
        attachment.setUploadedAt(LocalDateTime.now());

        return attachmentRepository.save(attachment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        attachmentRepository.deleteById(id);
    }
}