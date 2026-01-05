package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.models.Rating;
import com.hoangmp.imdb.payload.dto.RatingDTO;
import com.hoangmp.imdb.security.service.UserDetailsImpl;
import com.hoangmp.imdb.services.RatingService;
import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RatingController {
    @Autowired
    private RatingService ratingService;

    @PermitAll
    @PostMapping("/movie/{movieId}/rating/{score}")
    public ResponseEntity<RatingDTO> rateMovie(
            @PathVariable Long movieId,
            Authentication authentication,
            @PathVariable Integer score
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        RatingDTO response = ratingService.createRating(userId, movieId, score);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @DeleteMapping("/movie/rating/{id}")
    public ResponseEntity<RatingDTO> deleteRating(@PathVariable Long id) {
        RatingDTO response = ratingService.deleteRating(id);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @PutMapping("/movie/{movieId}/rating/{score}")
    public ResponseEntity<RatingDTO> updateRating(
            @PathVariable Long movieId,
            Authentication authentication,
            @PathVariable Integer score
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        RatingDTO response = ratingService.updateRating(userId, movieId, score);
        return ResponseEntity.ok().body(response);
    }
}
