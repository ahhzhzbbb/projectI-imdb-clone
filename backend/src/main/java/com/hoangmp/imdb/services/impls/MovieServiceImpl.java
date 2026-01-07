package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.Season;
import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.MovieDetailDTO;
import com.hoangmp.imdb.payload.request.MovieRequest;
import com.hoangmp.imdb.payload.response.MovieResponse;
import com.hoangmp.imdb.repositories.MovieRepository;
import com.hoangmp.imdb.services.MovieService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {
    private final ModelMapper modelMapper;

    private final MovieRepository movieRepository;

    @Transactional
    @Override
    public MovieDTO createMovie(MovieRequest movieRequest) {
        Movie newMovie = new Movie();
        modelMapper.map(movieRequest, newMovie);

        Season season1 = new Season(1);
        season1.setMovie(newMovie);
        newMovie.getSeasons().add(season1);

        movieRepository.save(newMovie);
        return modelMapper.map(newMovie, MovieDTO.class);
    }

    @Override
    public MovieResponse getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        List<MovieDTO> movieList = movies.stream()
                .map(movie -> new MovieDTO(movie.getId(), movie.getName(), movie.getDescription(), movie.getImageUrl(), movie.getTvSeries(), movie.getAverageScore(), movie.getReviewCount()))
                .toList();
        MovieResponse movieResponse = new MovieResponse();
        movieResponse.setMovies(movieList);
        return movieResponse;
    }

    @Override
    public MovieDetailDTO getMovieDetail(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie", "id", movieId)
                );
        return modelMapper.map(movie, MovieDetailDTO.class);
    }

    @Transactional
    @Override
    public MovieDTO deleteMovie(Long movieId) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie", "id", movieId)
                );

        movieRepository.delete(movie);

        return modelMapper.map(movie, MovieDTO.class);
    }

}
