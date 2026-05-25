package com.movieticket.dto.request;

import com.movieticket.enums.MovieStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
public class MovieRequest {
    @NotBlank
    private String title;

    private String description;
    private String posterUrl;
    private String trailerUrl;

    @NotNull
    private Integer duration;

    private LocalDate releaseDate;
    private Long genreId;

    @NotNull
    private MovieStatus status;
}
