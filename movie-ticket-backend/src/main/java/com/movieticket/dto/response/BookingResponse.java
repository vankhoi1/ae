package com.movieticket.dto.response;

import com.movieticket.enums.BookingStatus;
import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Builder
public class BookingResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private Long showtimeId;
    private String movieTitle;
    private LocalDateTime showtimeStart;
    private String roomName;
    private List<String> seats;
    private BigDecimal totalPrice;
    private BookingStatus status;
    private String paymentMethod;
    private LocalDateTime createdAt;
}
