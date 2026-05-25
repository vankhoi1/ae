package com.movieticket.service.impl;

import com.movieticket.dto.request.MovieRequest;
import com.movieticket.dto.response.MovieResponse;
import com.movieticket.entity.Genre;
import com.movieticket.entity.Movie;
import com.movieticket.enums.MovieStatus;
import com.movieticket.exception.ResourceNotFoundException;
import com.movieticket.repository.GenreRepository;
import com.movieticket.repository.MovieRepository;
import com.movieticket.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;

    @Override
    public List<MovieResponse> getAllMovies() {
        return movieRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public List<MovieResponse> getMoviesByStatus(MovieStatus status) {
        return movieRepository.findByStatus(status).stream().map(this::toResponse).toList();
    }

    @Override
    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
        return toResponse(movie);
    }

    @Override
    public MovieResponse createMovie(MovieRequest request) {
        Genre genre = null;
        if (request.getGenreId() != null) {
            genre = genreRepository.findById(request.getGenreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Genre not found"));
        }

        Movie movie = Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .posterUrl(request.getPosterUrl())
                .trailerUrl(request.getTrailerUrl())
                .duration(request.getDuration())
                .releaseDate(request.getReleaseDate())
                .genre(genre)
                .status(request.getStatus())
                .build();

        return toResponse(movieRepository.save(movie));
    }

    @Override
    public MovieResponse updateMovie(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));

        Genre genre = null;
        if (request.getGenreId() != null) {
            genre = genreRepository.findById(request.getGenreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Genre not found"));
        }

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setTrailerUrl(request.getTrailerUrl());
        movie.setDuration(request.getDuration());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setGenre(genre);
        movie.setStatus(request.getStatus());

        return toResponse(movieRepository.save(movie));
    }

    @Override
    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new ResourceNotFoundException("Movie not found with id: " + id);
        }
        movieRepository.deleteById(id);
    }

    private MovieResponse toResponse(Movie movie) {
        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .posterUrl(movie.getPosterUrl())
                .trailerUrl(movie.getTrailerUrl())
                .duration(movie.getDuration())
                .releaseDate(movie.getReleaseDate())
                .genreName(movie.getGenre() != null ? movie.getGenre().getName() : null)
                .genreId(movie.getGenre() != null ? movie.getGenre().getId() : null)
                .status(movie.getStatus())
                .build();
    }
}
