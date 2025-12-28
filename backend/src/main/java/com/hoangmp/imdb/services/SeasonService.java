package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.SeasonDTO;
import com.hoangmp.imdb.payload.request.SeasonRequest;
import com.hoangmp.imdb.payload.response.SeasonResponse;

public interface SeasonService {
    SeasonDTO createSeason(Long movieId);

    SeasonDTO deleteSeason(Long movieId);
}
