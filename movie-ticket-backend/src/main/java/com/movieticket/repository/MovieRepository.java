package com.movieticket.repository;

import com.movieticket.entity.Movie;
import com.movieticket.enums.MovieStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByStatus(MovieStatus status);
    List<Movie> findByGenreId(Long genreId);
}
