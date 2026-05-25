package com.movieticket.controller;

import com.movieticket.dto.response.GenreResponse;
import com.movieticket.entity.Genre;
import com.movieticket.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreRepository genreRepository;

    @GetMapping
    public ResponseEntity<List<GenreResponse>> getAllGenres() {
        List<GenreResponse> genres = genreRepository.findAll().stream()
                .map(g -> GenreResponse.builder().id(g.getId()).name(g.getName()).build())
                .toList();
        return ResponseEntity.ok(genres);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GenreResponse> createGenre(@RequestBody Genre genre) {
        Genre saved = genreRepository.save(genre);
        return ResponseEntity.ok(GenreResponse.builder().id(saved.getId()).name(saved.getName()).build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteGenre(@PathVariable Long id) {
        genreRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
