package com.movieticket.service;

import com.movieticket.dto.response.RevenueReportResponse;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;

public interface ReportService {
    List<RevenueReportResponse> getRevenueReport(LocalDate from, LocalDate to);
    ByteArrayInputStream exportRevenueReport(LocalDate from, LocalDate to);
}
