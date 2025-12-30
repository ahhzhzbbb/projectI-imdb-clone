package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.SeasonDTO;
import com.hoangmp.imdb.payload.dto.SeasonDetailDTO;
import com.hoangmp.imdb.services.SeasonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SeasonController {
    @Autowired
    private SeasonService seasonService;

    @PostMapping("/season/{id}")
    public ResponseEntity<SeasonDTO> addNewSeasonInMovie(@PathVariable Long id) {
        SeasonDTO response = seasonService.createSeason(id);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/season/{id}")
    public ResponseEntity<SeasonDTO> deleteLastSeason(@PathVariable Long id) {
        SeasonDTO response = seasonService.deleteSeason(id);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/season/{id}/episodes")
    public ResponseEntity<SeasonDetailDTO> getSeasonDetail(@PathVariable Long id) {
        SeasonDetailDTO response = seasonService.getSeasonDetail(id);
        return ResponseEntity.ok().body(response);
    }

}
