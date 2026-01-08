package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.DirectorDTO;
import com.hoangmp.imdb.payload.request.DirectorRequest;
import com.hoangmp.imdb.payload.response.DirectorResponse;
import com.hoangmp.imdb.services.DirectorService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/*
    * Director Controller
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DirectorController {
    private final DirectorService directorService;

    /* API tạo đạo diễn mới */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/director")
    public ResponseEntity<DirectorDTO> createDirector(@RequestBody DirectorRequest directorRequest) {
        DirectorDTO response = directorService.createDirector(directorRequest);
        return ResponseEntity.ok().body(response);
    }

    /* API xóa đạo diễn */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/director/{directorId}")
    public ResponseEntity<DirectorDTO> deleteDirector(@PathVariable Long directorId) {
        DirectorDTO response = directorService.deleteDirector(directorId);
        return ResponseEntity.ok().body(response);
    }

    /* API lấy tất cả đạo diễn */
    @PermitAll
    @GetMapping("/directors")
    public ResponseEntity<DirectorResponse> getAllDirectors() {
        DirectorResponse response = directorService.getAllDirectors();
        return ResponseEntity.ok().body(response);
    }

    /* API cập nhật thông tin đạo diễn */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/director/{id}")
    public ResponseEntity<DirectorDTO> updateDirector(@PathVariable Long id, @RequestBody DirectorRequest directorRequest) {
        DirectorDTO response = directorService.updateDirector(id, directorRequest);
        return ResponseEntity.ok().body(response);
    }
}
