package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.SeasonDTO;
import com.hoangmp.imdb.payload.dto.SeasonDetailDTO;

public interface SeasonService {
    SeasonDTO createSeason(Long movieId);

    SeasonDTO deleteSeason(Long movieId);

    SeasonDetailDTO getSeasonDetail(Long seasonId);
}
