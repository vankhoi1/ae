package com.movieticket.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class RoomResponse {
    private Long id;
    private String name;
    private Integer rowsCount;
    private Integer columnsCount;
}
