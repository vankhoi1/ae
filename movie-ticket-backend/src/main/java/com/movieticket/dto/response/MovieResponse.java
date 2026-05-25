package com.movieticket.dto.response;

import com.movieticket.enums.MovieStatus;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;

@Getter @Builder
public class MovieResponse {
    private Long id;
    private String title;
    private String description;
    private String posterUrl;
    private String trailerUrl;
    private Integer duration;
    private LocalDate releaseDate;
    private String genreName;
    private Long genreId;
    private MovieStatus status;
}
