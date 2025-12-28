package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.MovieDetailDTO;
import com.hoangmp.imdb.payload.request.MovieRequest;
import com.hoangmp.imdb.payload.response.MovieResponse;
import com.hoangmp.imdb.services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MovieController {
    @Autowired
    private MovieService movieService;

    @PostMapping("/movie")
    public ResponseEntity<MovieDTO> createMovie(@RequestBody MovieRequest movieRequest) {
        MovieDTO response = movieService.createMovie(movieRequest);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/movies")
    public ResponseEntity<MovieResponse> getAllMovies() {
        MovieResponse response = movieService.getAllMovies();
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/movie/{movieId}")
    public ResponseEntity<MovieDTO> deleteMovie(@PathVariable Long movieId) {
        MovieDTO response = movieService.deleteMovie(movieId);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<MovieDetailDTO> getMovieDetail(@PathVariable Long movieId) {
        MovieDetailDTO response = movieService.getMovieDetail(movieId);
        return ResponseEntity.ok().body(response);
    }
}
