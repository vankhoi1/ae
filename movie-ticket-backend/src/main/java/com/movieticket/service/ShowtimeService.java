package com.movieticket.service;

import com.movieticket.dto.request.ShowtimeRequest;
import com.movieticket.dto.response.ShowtimeResponse;

import java.time.LocalDate;
import java.util.List;

public interface ShowtimeService {
    List<ShowtimeResponse> getAllShowtimes();
    List<ShowtimeResponse> getShowtimesByMovieAndDate(Long movieId, LocalDate date);
    ShowtimeResponse getShowtimeById(Long id);
    ShowtimeResponse createShowtime(ShowtimeRequest request);
    ShowtimeResponse updateShowtime(Long id, ShowtimeRequest request);
    void deleteShowtime(Long id);
}
