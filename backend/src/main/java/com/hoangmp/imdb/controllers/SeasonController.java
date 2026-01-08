package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.SeasonDTO;
import com.hoangmp.imdb.payload.dto.SeasonDetailDTO;
import com.hoangmp.imdb.services.SeasonService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/*
    * Season Controller
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SeasonController {
    private final SeasonService seasonService;

    /* API thêm season mới cho một phim */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/season/{id}")
    public ResponseEntity<SeasonDTO> addNewSeasonInMovie(@PathVariable Long id) {
        SeasonDTO response = seasonService.createSeason(id);
        return ResponseEntity.ok().body(response);
    }

    /* API xóa season cuối cùng của một phim */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/season/{id}")
    public ResponseEntity<SeasonDTO> deleteLastSeason(@PathVariable Long id) {
        SeasonDTO response = seasonService.deleteSeason(id);
        return ResponseEntity.ok().body(response);
    }

    /* API lấy chi tiết một season, bao gồm các tập phim */
    @PermitAll
    @GetMapping("/season/{id}/episodes")
    public ResponseEntity<SeasonDetailDTO> getSeasonDetail(@PathVariable Long id) {
        SeasonDetailDTO response = seasonService.getSeasonDetail(id);
        return ResponseEntity.ok().body(response);
    }

}
