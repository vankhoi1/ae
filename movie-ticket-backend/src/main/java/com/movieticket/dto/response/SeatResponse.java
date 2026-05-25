package com.movieticket.dto.response;

import com.movieticket.enums.SeatType;
import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class SeatResponse {
    private Long id;
    private String seatRow;
    private Integer seatNumber;
    private SeatType type;
    private boolean occupied;
}
