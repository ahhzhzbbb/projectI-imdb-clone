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

/*
    * Rating Controller
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;

    /* API đánh giá một tập phim */
    @PermitAll
    @PostMapping("/episode/{episodeId}/rating")
    public ResponseEntity<RatingDTO> rateMovie(
            Authentication authentication,
            @PathVariable Long episodeId,
            @RequestBody RatingRequest request) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        RatingDTO response = ratingService.createRating(userId, episodeId, request);
        return ResponseEntity.ok().body(response);
    }

    /* API lấy đánh giá của user cho một tập phim */
    @PermitAll
    @GetMapping("/episode/{episodeId}/rating")
    public ResponseEntity<RatingDTO> getUserRating(
            Authentication authentication,
            @PathVariable Long episodeId) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        RatingDTO response = ratingService.getUserRatingForEpisode(userId, episodeId);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(response);
    }

    /* API xóa đánh giá của một tập phim */
    @PermitAll
    @DeleteMapping("/episode/{episodeId}/rating")
    public ResponseEntity<RatingDTO> removeRating(
            Authentication authentication,
            @PathVariable Long episodeId) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        RatingDTO response = ratingService.removeRating(userId, episodeId);
        return ResponseEntity.ok().body(response);
    }

    /* API cập nhật đánh giá của một tập phim */
    @PermitAll
    @PutMapping("/episode/{episodeId}/rating")
    public ResponseEntity<RatingDTO> updateRating(
            @PathVariable Long episodeId,
            Authentication authentication,
            @RequestBody RatingRequest request) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        RatingDTO response = ratingService.updateRating(userId, episodeId, request);
        return ResponseEntity.ok().body(response);
    }
}
