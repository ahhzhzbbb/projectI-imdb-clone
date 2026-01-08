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

/*
    * Movie Controller
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MovieController {
    private final MovieService movieService;

    /* API tạo phim mới */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/movie")
    public ResponseEntity<MovieDTO> createMovie(@RequestBody MovieRequest movieRequest) {
        MovieDTO response = movieService.createMovie(movieRequest);
        return ResponseEntity.ok().body(response);
    }

    /* API lấy tất cả phim */
    @PermitAll
    @GetMapping("/movies")
    public ResponseEntity<MovieResponse> getAllMovies() {
        MovieResponse response = movieService.getAllMovies();
        return ResponseEntity.ok().body(response);
    }

    /* API cập nhật thông tin phim */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/movie/{movieId}")
    public ResponseEntity<MovieDTO> deleteMovie(@PathVariable Long movieId) {
        MovieDTO response = movieService.deleteMovie(movieId);
        return ResponseEntity.ok().body(response);
    }

    /* API lấy chi tiết phim bao gồm các season và tập phim */
    @PermitAll
    @GetMapping("/movie/{movieId}/seasons")
    public ResponseEntity<MovieDetailDTO> getMovieDetail(@PathVariable Long movieId) {
        MovieDetailDTO response = movieService.getMovieDetail(movieId);
        return ResponseEntity.ok().body(response);
    }
}
