package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.GenreDTO;
import com.hoangmp.imdb.payload.request.GenreRequest;
import com.hoangmp.imdb.payload.response.GenreResponse;
import com.hoangmp.imdb.services.GenreService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class GenreController {
    @Autowired
    private GenreService genreService;

    @PostMapping("/genre")
    public ResponseEntity<GenreDTO> createGenre(@RequestBody GenreRequest request) {
        GenreDTO response = genreService.createGenre(request);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/genre/{id}")
    public ResponseEntity<GenreDTO> deleteGenre(@PathVariable Long id) {
        GenreDTO response = genreService.deleteGenre(id);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/genres")
    public ResponseEntity<GenreResponse> getAllGenre() {
        GenreResponse response = genreService.getAllGenre();
        return ResponseEntity.ok().body(response);
    }
}
