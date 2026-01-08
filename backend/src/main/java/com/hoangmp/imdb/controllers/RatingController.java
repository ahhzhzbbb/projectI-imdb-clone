package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.RatingDTO;
import com.hoangmp.imdb.payload.request.RatingRequest;
import com.hoangmp.imdb.security.service.UserDetailsImpl;
import com.hoangmp.imdb.services.RatingService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;

    @PermitAll
    @PostMapping("/episode/{episodeId}/rating")
    public ResponseEntity<RatingDTO> rateMovie(
            Authentication authentication,
            @PathVariable Long episodeId,
            @RequestBody RatingRequest request
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        RatingDTO response = ratingService.createRating(userId, episodeId, request);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @DeleteMapping("/episode/{episodeId}/rating")
    public ResponseEntity<RatingDTO> removeRating(
            Authentication authentication,
            @PathVariable Long episodeId
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        RatingDTO response = ratingService.removeRating(userId, episodeId);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @PutMapping("/episode/{episodeId}/rating")
    public ResponseEntity<RatingDTO> updateRating(
            @PathVariable Long episodeId,
            Authentication authentication,
            @RequestBody RatingRequest request
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        RatingDTO response = ratingService.updateRating(userId, episodeId, request);
        return ResponseEntity.ok().body(response);
    }
}
