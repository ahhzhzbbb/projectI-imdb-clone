package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.SeasonDTO;
import com.hoangmp.imdb.payload.dto.SeasonDetailDTO;
import com.hoangmp.imdb.services.SeasonService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SeasonController {
    private final SeasonService seasonService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/season/{id}")
    public ResponseEntity<SeasonDTO> addNewSeasonInMovie(@PathVariable Long id) {
        SeasonDTO response = seasonService.createSeason(id);
        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/season/{id}")
    public ResponseEntity<SeasonDTO> deleteLastSeason(@PathVariable Long id) {
        SeasonDTO response = seasonService.deleteSeason(id);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/season/{id}/episodes")
    public ResponseEntity<SeasonDetailDTO> getSeasonDetail(@PathVariable Long id) {
        SeasonDetailDTO response = seasonService.getSeasonDetail(id);
        return ResponseEntity.ok().body(response);
    }

}
