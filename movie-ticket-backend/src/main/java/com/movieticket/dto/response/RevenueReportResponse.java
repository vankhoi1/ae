package com.movieticket.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Builder
public class RevenueReportResponse {
    private LocalDate date;
    private Long totalBookings;
    private Long totalTickets;
    private BigDecimal totalRevenue;
}
