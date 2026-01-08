package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.ReviewDTO;
import com.hoangmp.imdb.payload.request.ReviewRequest;
import com.hoangmp.imdb.payload.response.ReviewResponse;

public interface ReviewService {
    ReviewDTO createReview(Long userId, Long movieId, ReviewRequest reviewRequest);

    ReviewDTO removeReview(Long userId, Long movieId);

    ReviewDTO updateReview(Long userId, Long movieId, ReviewRequest reviewRequest);

    ReviewResponse getReviewsFromMovie(Long movieId);
}
