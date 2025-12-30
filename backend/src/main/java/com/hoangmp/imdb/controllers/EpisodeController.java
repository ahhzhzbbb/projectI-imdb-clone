package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.EpisodeDTO;
import com.hoangmp.imdb.payload.request.EpisodeRequest;
import com.hoangmp.imdb.services.impls.EpisodeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class EpisodeController {
    @Autowired
    private EpisodeServiceImpl episodeService;

    @PostMapping("/seasons/{seasonId}/episode")
    public ResponseEntity<EpisodeDTO> createEpisode(@PathVariable Long seasonId, @RequestBody EpisodeRequest request) {
        EpisodeDTO response = episodeService.createEpisode(seasonId, request);
        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/episode/{id}")
    public ResponseEntity<EpisodeDTO> updateEpisode(@PathVariable Long id, @RequestBody EpisodeRequest request) {
        EpisodeDTO response = episodeService.updateEpisode(id, request);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/episode/{id}")
    public ResponseEntity<EpisodeDTO> deleteEpisode(@PathVariable Long id) {
        EpisodeDTO response = episodeService.deleteEpisode(id);
        return ResponseEntity.ok().body(response);
    }
}
