package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.GenreDTO;
import com.hoangmp.imdb.payload.request.GenreRequest;
import com.hoangmp.imdb.payload.response.GenreResponse;
import com.hoangmp.imdb.services.GenreService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
    * Genre Controller
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GenreController {
    private final GenreService genreService;

    /* API tạo thể loại mới */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/genre")
    public ResponseEntity<GenreDTO> createGenre(@RequestBody GenreRequest request) {
        GenreDTO response = genreService.createGenre(request);
        return ResponseEntity.ok().body(response);
    }

    /* API cập nhật thể loại */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/genre/{id}")
    public ResponseEntity<GenreDTO> deleteGenre(@PathVariable Long id) {
        GenreDTO response = genreService.deleteGenre(id);
        return ResponseEntity.ok().body(response);
    }

    /* API lấy tất cả thể loại */
    @PermitAll
    @GetMapping("/genres")
    public ResponseEntity<GenreResponse> getAllGenre() {
        GenreResponse response = genreService.getAllGenre();
        return ResponseEntity.ok().body(response);
    }
}
