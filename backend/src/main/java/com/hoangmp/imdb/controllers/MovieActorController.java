package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.ActorDTO;
import com.hoangmp.imdb.payload.dto.MovieActorDTO;
import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.services.MovieActorService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MovieActorController {
    private final MovieActorService movieActorService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/movie/{movieId}/actor/{actorId}")
    public ResponseEntity<MovieActorDTO> addActorToMovie(@PathVariable Long movieId, @PathVariable Long actorId) {
        MovieActorDTO response = movieActorService.addActorToMovie(actorId, movieId);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/movie/{movieId}/actor/{actorId}")
    public ResponseEntity<MovieActorDTO> removeActorFromMovie(@PathVariable Long movieId, @PathVariable Long actorId) {
        MovieActorDTO response = movieActorService.removeActorFromMovie(movieId, actorId);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/movie/{movieId}/actors")
    public ResponseEntity<List<ActorDTO>> getActorsOfMovie(@PathVariable Long movieId) {
        List<ActorDTO> response = movieActorService.getActorsOfMovie(movieId);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/actor/{actorId}/movies")
    public ResponseEntity<List<MovieDTO>> getMoviesOfActor(@PathVariable Long actorId) {
        List<MovieDTO> response = movieActorService.getMoviesOfActor(actorId);
        return ResponseEntity.ok().body(response);
    }
}
