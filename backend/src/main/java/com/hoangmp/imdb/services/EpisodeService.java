package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.EpisodeDTO;
import com.hoangmp.imdb.payload.request.EpisodeRequest;

public interface EpisodeService {
    public EpisodeDTO createEpisode(Long seasonID, EpisodeRequest episodeRequest);

    public EpisodeDTO updateEpisode(Long episodeId, EpisodeRequest episodeRequest);

    public EpisodeDTO deleteEpisode(Long epidoseId);
}
