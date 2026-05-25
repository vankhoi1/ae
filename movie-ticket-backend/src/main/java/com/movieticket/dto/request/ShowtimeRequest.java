package com.movieticket.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
public class ShowtimeRequest {
    @NotNull
    private Long movieId;

    @NotNull
    private Long roomId;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;

    @NotNull
    private LocalDate date;

    @NotNull
    private BigDecimal priceStandard;

    @NotNull
    private BigDecimal priceVip;
}
