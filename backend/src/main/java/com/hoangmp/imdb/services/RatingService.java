package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.RatingDTO;
import com.hoangmp.imdb.payload.request.RatingRequest;

public interface RatingService {
    RatingDTO createRating(Long userId, Long episodeId, RatingRequest ratingRequest);

    RatingDTO removeRating(Long userId, Long episodeId);

    RatingDTO updateRating(Long userId, Long episodeId, RatingRequest ratingRequest);
}
