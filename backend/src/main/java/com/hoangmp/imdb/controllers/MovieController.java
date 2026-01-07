package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.MovieDetailDTO;
import com.hoangmp.imdb.payload.request.MovieRequest;
import com.hoangmp.imdb.payload.response.MovieResponse;
import com.hoangmp.imdb.services.MovieService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MovieController {
    private final MovieService movieService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/movie")
    public ResponseEntity<MovieDTO> createMovie(@RequestBody MovieRequest movieRequest) {
        MovieDTO response = movieService.createMovie(movieRequest);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/movies")
    public ResponseEntity<MovieResponse> getAllMovies() {
        MovieResponse response = movieService.getAllMovies();
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/movie/{movieId}")
    public ResponseEntity<MovieDTO> deleteMovie(@PathVariable Long movieId) {
        MovieDTO response = movieService.deleteMovie(movieId);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/movie/{movieId}/seasons")
    public ResponseEntity<MovieDetailDTO> getMovieDetail(@PathVariable Long movieId) {
        MovieDetailDTO response = movieService.getMovieDetail(movieId);
        return ResponseEntity.ok().body(response);
    }
}
