package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Episode;
import com.hoangmp.imdb.models.Season;
import com.hoangmp.imdb.payload.dto.EpisodeDTO;
import com.hoangmp.imdb.payload.request.EpisodeRequest;
import com.hoangmp.imdb.repositories.EpisodeRepository;
import com.hoangmp.imdb.repositories.SeasonRepository;
import com.hoangmp.imdb.services.EpisodeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EpisodeServiceImpl implements EpisodeService {

    private final EpisodeRepository episodeRepository;

    private final SeasonRepository seasonRepository;

    private final ModelMapper modelMapper;

    @Transactional
    @Override
    public EpisodeDTO createEpisode(Long seasonID, EpisodeRequest episodeRequest) {
        Season season = seasonRepository.findById(seasonID)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Season", "id", seasonID)
                );
        Episode newEpisode = new Episode();
        modelMapper.map(episodeRequest, newEpisode);
        season.getEpisodes().add(newEpisode);
        newEpisode.setSeason(season);
        episodeRepository.save(newEpisode);
        return modelMapper.map(newEpisode, EpisodeDTO.class);
    }

    @Transactional
    @Override
    public EpisodeDTO updateEpisode(Long episodeId, EpisodeRequest episodeRequest) {
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Episode", "id", episodeId)
                );
        modelMapper.map(episodeRequest, episode);
        return modelMapper.map(episode, EpisodeDTO.class);
    }

    @Transactional
    @Override
    public EpisodeDTO deleteEpisode(Long episodeId) {
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Episode", "id", episodeId)
                );

        EpisodeDTO episodeDTO = modelMapper.map(episode, EpisodeDTO.class);
        episodeRepository.delete(episode);

        return episodeDTO;
    }
}
