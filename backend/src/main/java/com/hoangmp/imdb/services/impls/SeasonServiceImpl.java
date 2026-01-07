package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.Season;
import com.hoangmp.imdb.payload.dto.SeasonDTO;
import com.hoangmp.imdb.payload.dto.SeasonDetailDTO;
import com.hoangmp.imdb.repositories.MovieRepository;
import com.hoangmp.imdb.repositories.SeasonRepository;
import com.hoangmp.imdb.services.SeasonService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class SeasonServiceImpl implements SeasonService {

    private final SeasonRepository seasonRepository;

    private final ModelMapper modelMapper;

    private final MovieRepository movieRepository;

    @Transactional
    @Override
    public SeasonDTO createSeason(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie", "id", movieId)
                );
        Season newSeason = new Season();
        newSeason.setNumber(movie.getSeasons().size() + 1);
        newSeason.setMovie(movie);
        Season savedSeason = seasonRepository.save(newSeason);
        return modelMapper.map(savedSeason, SeasonDTO.class);
    }

    @Transactional
    public SeasonDTO deleteSeason(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", movieId));

        if (movie.getSeasons().isEmpty()) {
            throw new IllegalStateException("No seasons to delete");
        }

        Season lastSeason = movie.getSeasons().stream()
                .max(Comparator.comparingInt(Season::getNumber))
                .orElseThrow();

        movie.getSeasons().remove(lastSeason);
        return modelMapper.map(lastSeason, SeasonDTO.class);
    }

    @Override
    public SeasonDetailDTO getSeasonDetail(Long seasonId) {
        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Season", "id", seasonId)
                );
        return modelMapper.map(season, SeasonDetailDTO.class);
    }
}
