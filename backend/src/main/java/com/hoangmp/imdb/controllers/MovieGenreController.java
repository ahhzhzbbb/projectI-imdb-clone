package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.GenreDTO;
import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.MovieGenreDTO;
import com.hoangmp.imdb.services.MovieGenreService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
    * Movie Genre Controller
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MovieGenreController {
    private final MovieGenreService movieGenreService;

    /* API thêm thể loại vào phim */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/movie/{movieId}/genre/{genreId}")
    public ResponseEntity<MovieGenreDTO> addGenreToMovie(@PathVariable Long movieId, @PathVariable Long genreId) {
        MovieGenreDTO response = movieGenreService.addGenreToMovie(movieId, genreId);
        return ResponseEntity.ok().body(response);
    }

    /* API xóa thể loại khỏi phim */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/movie/{movieId}/genre/{genreId}")
    public ResponseEntity<MovieGenreDTO> removeGenreFromMovie(@PathVariable Long movieId, @PathVariable Long genreId) {
        MovieGenreDTO response = movieGenreService.removeGenreFromMovie(movieId, genreId);
        return ResponseEntity.ok().body(response);
    }

    /* API lấy tất cả thể loại của một phim */
    @PermitAll
    @GetMapping("/movie/{movieId}/genres")
    public ResponseEntity<List<GenreDTO>> getGenresOfMovie(@PathVariable Long movieId) {
        List<GenreDTO> response = movieGenreService.getGenresOfMovie(movieId);
        return ResponseEntity.ok().body(response);
    }

    /* API lấy tất cả phim của một thể loại */
    @PermitAll
    @GetMapping("/genre/{genreId}/movies")
    public ResponseEntity<List<MovieDTO>> getMoviesOfGenre(@PathVariable Long genreId) {
        List<MovieDTO> response = movieGenreService.getMoviesOfGenre(genreId);
        return ResponseEntity.ok().body(response);
    }
}
