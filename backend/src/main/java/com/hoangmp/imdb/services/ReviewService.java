package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.ReviewDTO;
import com.hoangmp.imdb.payload.request.ReviewRequest;
import com.hoangmp.imdb.payload.response.ReviewResponse;

public interface ReviewService {
    ReviewDTO createReview(Long userId, Long movieId, ReviewRequest reviewRequest);

    ReviewDTO deleteReview(Long reviewId);

    ReviewDTO updateReview(Long reviewId, ReviewRequest reviewRequest);

    ReviewResponse getReviewsFromMovie(Long movieId);
}
