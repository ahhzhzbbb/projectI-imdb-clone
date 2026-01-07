package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.EpisodeDTO;
import com.hoangmp.imdb.payload.request.EpisodeRequest;

public interface EpisodeService {
    EpisodeDTO createEpisode(Long seasonID, EpisodeRequest episodeRequest);

    EpisodeDTO updateEpisode(Long episodeId, EpisodeRequest episodeRequest);

    EpisodeDTO deleteEpisode(Long epidoseId);
}
