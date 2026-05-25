package com.movieticket.service;

import com.movieticket.dto.request.MovieRequest;
import com.movieticket.dto.response.MovieResponse;
import com.movieticket.enums.MovieStatus;

import java.util.List;

public interface MovieService {
    List<MovieResponse> getAllMovies();
    List<MovieResponse> getMoviesByStatus(MovieStatus status);
    MovieResponse getMovieById(Long id);
    MovieResponse createMovie(MovieRequest request);
    MovieResponse updateMovie(Long id, MovieRequest request);
    void deleteMovie(Long id);
}
