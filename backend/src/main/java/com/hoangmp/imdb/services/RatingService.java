package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.RatingDTO;

public interface RatingService {
    public RatingDTO createRating(Long userId, Long movieId, Integer score);

    public RatingDTO deleteRating(Long ratingId);

    public RatingDTO updateRating(Long userId, Long movieId, Integer score);
}
