package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.RatingDTO;
import com.hoangmp.imdb.payload.request.RatingRequest;

public interface RatingService {
    public RatingDTO createRating(Long userId, Long episodeId, RatingRequest ratingRequest);

    public RatingDTO deleteRating(Long ratingId);

    public RatingDTO updateRating(Long userId, Long episodeId, RatingRequest ratingRequest);
}
