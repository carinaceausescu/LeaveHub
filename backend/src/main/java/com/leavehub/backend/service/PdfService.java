package com.leavehub.backend.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.leavehub.backend.model.LeaveRequest;
import org.springframework.stereotype.Service;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPCell;
import com.leavehub.backend.model.Employee;
import java.awt.Color;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] generatePendingRequestsReport(List<LeaveRequest> pendingRequests) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Cereri în așteptare", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            addHeaderCell(table, "Angajat");
            addHeaderCell(table, "Departament");
            addHeaderCell(table, "Tip concediu");
            addHeaderCell(table, "Perioada");
            addHeaderCell(table, "Zile");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

            for (LeaveRequest r : pendingRequests) {
                table.addCell(r.getEmployee().getName());
                table.addCell(r.getEmployee().getDepartment() != null ? r.getEmployee().getDepartment().getDepartmentName() : "N/A");
                table.addCell(r.getLeaveType().getName());
                table.addCell(r.getStartDate().format(formatter) + " - " + r.getEndDate().format(formatter));
                table.addCell(String.valueOf(r.getWorkingDays()));
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Eroare la generarea raportului", e);
        }

        return out.toByteArray();
    }

    public byte[] generateDepartmentBalanceReport(List<Employee> employees) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Sold de zile per departament", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            addHeaderCell(table, "Angajat");
            addHeaderCell(table, "Departament");
            addHeaderCell(table, "Zile disponibile");
            addHeaderCell(table, "Zile anuale");

            for (Employee e : employees) {
                table.addCell(e.getName());
                table.addCell(e.getDepartment() != null ? e.getDepartment().getDepartmentName() : "N/A");
                table.addCell(String.valueOf(e.getAvailableLeaveDays()));
                table.addCell(String.valueOf(e.getAnnualLeaveDays()));
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Eroare la generarea raportului", e);
        }

        return out.toByteArray();
    }

    public byte[] generateLeaveUsageReport(List<LeaveRequest> approvedRequests) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Utilizare concedii pe tipuri", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            Map<String, int[]> stats = new LinkedHashMap<>();
            for (LeaveRequest r : approvedRequests) {
                String typeName = r.getLeaveType().getName();
                stats.putIfAbsent(typeName, new int[2]);
                stats.get(typeName)[0]++;
                stats.get(typeName)[1] += r.getWorkingDays();
            }

            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            addHeaderCell(table, "Tip concediu");
            addHeaderCell(table, "Nr. cereri aprobate");
            addHeaderCell(table, "Total zile consumate");

            for (Map.Entry<String, int[]> entry : stats.entrySet()) {
                table.addCell(entry.getKey());
                table.addCell(String.valueOf(entry.getValue()[0]));
                table.addCell(String.valueOf(entry.getValue()[1]));
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Eroare la generarea raportului", e);
        }

        return out.toByteArray();
    }

    private void addHeaderCell(PdfPTable table, String text) {
        Font headerFont = new Font(Font.HELVETICA, 11, Font.BOLD);
        PdfPCell cell = new PdfPCell(new Phrase(text, headerFont));
        cell.setBackgroundColor(new Color(230, 230, 230));
        table.addCell(cell);
    }

    public byte[] generateLeaveRequestPdf(LeaveRequest request) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Cerere de Concediu", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph(" "));

            Font normalFont = new Font(Font.HELVETICA, 12);

            document.add(new Paragraph("Angajat: " + request.getEmployee().getName(), normalFont));
            document.add(new Paragraph("Email: " + request.getEmployee().getEmail(), normalFont));
            document.add(new Paragraph("Departament: " +
                    (request.getEmployee().getDepartment() != null ? request.getEmployee().getDepartment().getDepartmentName() : "N/A"),
                    normalFont));

            document.add(new Paragraph(" "));

            document.add(new Paragraph("Tip concediu: " + request.getLeaveType().getName(), normalFont));

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            String perioada = request.getStartDate().format(formatter) + " - " + request.getEndDate().format(formatter);

            document.add(new Paragraph("Perioada: " + perioada, normalFont));
            document.add(new Paragraph("Zile lucratoare: " + request.getWorkingDays(), normalFont));
            document.add(new Paragraph("Status: " + request.getStatus(), normalFont));
            document.add(new Paragraph("Data crearii: " + request.getCreatedAt(), normalFont));

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Eroare la generarea PDF-ului", e);
        }

        return out.toByteArray();
    }
}