package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.GenreDTO;
import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.MovieGenreDTO;
import com.hoangmp.imdb.services.MovieGenreService;
import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MovieGenreController {
    @Autowired
    private MovieGenreService movieGenreService;
    @Autowired
    private PersistenceExceptionTranslationPostProcessor persistenceExceptionTranslationPostProcessor;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/movie/{movieId}/genre/{genreId}")
    public ResponseEntity<MovieGenreDTO> addGenreToMovie(@PathVariable Long movieId, @PathVariable Long genreId) {
        MovieGenreDTO response = movieGenreService.addGenreToMovie(movieId, genreId);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/movie/{movieId}/genre/{genreId}")
    public ResponseEntity<MovieGenreDTO> removeGenreFromMovie(@PathVariable Long movieId, @PathVariable Long genreId) {
        MovieGenreDTO response = movieGenreService.removeGenreFromMovie(movieId, genreId);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/movie/{movieId}/genres")
    public ResponseEntity<List<GenreDTO>> getGenresOfMovie(@PathVariable Long movieId) {
        List<GenreDTO> response = movieGenreService.getGenresOfMovie(movieId);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/genre/{genreId}/movies")
    public ResponseEntity<List<MovieDTO>> getMoviesOfGenre(@PathVariable Long genreId) {
        List<MovieDTO> response = movieGenreService.getMoviesOfGenre(genreId);
        return ResponseEntity.ok().body(response);
    }
}
