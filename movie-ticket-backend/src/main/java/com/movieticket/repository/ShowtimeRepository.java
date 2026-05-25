package com.movieticket.repository;

import com.movieticket.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    List<Showtime> findByMovieId(Long movieId);
    List<Showtime> findByDate(LocalDate date);
    List<Showtime> findByMovieIdAndDate(Long movieId, LocalDate date);
}
