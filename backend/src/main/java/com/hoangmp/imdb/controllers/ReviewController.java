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
    @DeleteMapping("/review/{id}")
    public ResponseEntity<ReviewDTO> deleteReview(@PathVariable Long id) {
        ReviewDTO response = reviewService.deleteReview(id);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @PutMapping("/review/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(@PathVariable Long reviewId, @RequestBody ReviewRequest request) {
        ReviewDTO response = reviewService.updateReview(reviewId, request);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/movie/{movieId}/reviews")
    public ResponseEntity<ReviewResponse> getReviewsFromMovie(@PathVariable Long movieId) {
        ReviewResponse response = reviewService.getReviewsFromMovie(movieId);
        return ResponseEntity.ok().body(response);
    }
}
