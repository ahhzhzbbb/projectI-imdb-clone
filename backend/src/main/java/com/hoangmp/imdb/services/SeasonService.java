package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.SeasonDTO;

public interface SeasonService {
    SeasonDTO createSeason();

    SeasonDTO deleteSeason();
}
