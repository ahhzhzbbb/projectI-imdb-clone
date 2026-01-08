package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.ReviewDTO;
import com.hoangmp.imdb.payload.request.ReviewRequest;
import com.hoangmp.imdb.payload.response.ReviewResponse;
import com.hoangmp.imdb.security.service.UserDetailsImpl;
import com.hoangmp.imdb.services.ReviewService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PermitAll
    @PostMapping("/movie/{movieId}/review")
    public ResponseEntity<ReviewDTO> createReview(
            Authentication authentication,
            @PathVariable Long movieId,
            @RequestBody ReviewRequest request
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        ReviewDTO response = reviewService.createReview(userId, movieId, request);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @DeleteMapping("/movie/{movieId}/review")
    public ResponseEntity<ReviewDTO> removeReview(
            Authentication authentication,
            @PathVariable Long movieId
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        ReviewDTO response = reviewService.removeReview(userId, movieId);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @PutMapping("/movie/{movieId}/review")
    public ResponseEntity<ReviewDTO> updateReview(
            Authentication authentication,
            @PathVariable Long movieId,
            @RequestBody ReviewRequest request
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        ReviewDTO response = reviewService.updateReview(userId, movieId, request);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/movie/{movieId}/reviews")
    public ResponseEntity<ReviewResponse> getReviewsFromMovie(@PathVariable Long movieId) {
        ReviewResponse response = reviewService.getReviewsFromMovie(movieId);
        return ResponseEntity.ok().body(response);
    }
}
