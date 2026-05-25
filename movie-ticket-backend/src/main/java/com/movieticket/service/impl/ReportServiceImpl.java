package com.movieticket.service.impl;

import com.movieticket.dto.response.RevenueReportResponse;
import com.movieticket.repository.BookingRepository;
import com.movieticket.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final BookingRepository bookingRepository;

    @Override
    public List<RevenueReportResponse> getRevenueReport(LocalDate from, LocalDate to) {
        // Simplified - in production, use a custom query with aggregation
        List<RevenueReportResponse> reports = new ArrayList<>();
        LocalDate current = from;
        while (!current.isAfter(to)) {
            reports.add(RevenueReportResponse.builder()
                    .date(current)
                    .totalBookings(0L)
                    .totalTickets(0L)
                    .totalRevenue(BigDecimal.ZERO)
                    .build());
            current = current.plusDays(1);
        }
        return reports;
    }

    @Override
    public ByteArrayInputStream exportRevenueReport(LocalDate from, LocalDate to) {
        List<RevenueReportResponse> data = getRevenueReport(from, to);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Revenue Report");

            Row headerRow = sheet.createRow(0);
            String[] columns = {"Date", "Total Bookings", "Total Tickets", "Total Revenue"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }

            int rowNum = 1;
            for (RevenueReportResponse item : data) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(item.getDate().toString());
                row.createCell(1).setCellValue(item.getTotalBookings());
                row.createCell(2).setCellValue(item.getTotalTickets());
                row.createCell(3).setCellValue(item.getTotalRevenue().doubleValue());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to export report", e);
        }
    }
}
