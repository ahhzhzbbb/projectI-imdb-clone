package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.Season;
import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.MovieDetailDTO;
import com.hoangmp.imdb.payload.request.MovieRequest;
import com.hoangmp.imdb.payload.response.MovieResponse;
import com.hoangmp.imdb.repositories.DirectorRepository;
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

    private final DirectorRepository directorRepository;

    @Transactional
    @Override
    public MovieDTO createMovie(MovieRequest movieRequest) {
        Movie newMovie = new Movie();
        modelMapper.map(movieRequest, newMovie);

        // Set director if provided
        if (movieRequest.getDirectorId() != null) {
            directorRepository.findById(movieRequest.getDirectorId())
                    .ifPresent(newMovie::setDirector);
        }

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
                .map(movie -> new MovieDTO(movie.getId(), movie.getName(), movie.getDescription(), movie.getImageUrl(),
                        movie.getTvSeries(), movie.getAverageScore(), movie.getReviewCount()))
                .toList();
        MovieResponse movieResponse = new MovieResponse();
        movieResponse.setMovies(movieList);
        return movieResponse;
    }

    @Override
    public MovieDetailDTO getMovieDetail(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", movieId));
        return modelMapper.map(movie, MovieDetailDTO.class);
    }

    @Transactional
    @Override
    public MovieDTO deleteMovie(Long movieId) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", movieId));

        movieRepository.delete(movie);

        return modelMapper.map(movie, MovieDTO.class);
    }

    @Transactional
    @Override
    public MovieDTO updateMovie(Long movieId, MovieRequest movieRequest) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", movieId));

        // Update only non-null fields
        if (movieRequest.getMovieName() != null && !movieRequest.getMovieName().isEmpty()) {
            movie.setName(movieRequest.getMovieName());
        }
        if (movieRequest.getDescription() != null) {
            movie.setDescription(movieRequest.getDescription());
        }
        if (movieRequest.getImageUrl() != null) {
            movie.setImageUrl(movieRequest.getImageUrl());
        }
        if (movieRequest.getTrailerUrl() != null) {
            movie.setTrailerUrl(movieRequest.getTrailerUrl());
        }
        if (movieRequest.getTvSeries() != null) {
            movie.setTvSeries(movieRequest.getTvSeries());
        }
        // Update director if provided
        if (movieRequest.getDirectorId() != null) {
            directorRepository.findById(movieRequest.getDirectorId())
                    .ifPresent(movie::setDirector);
        }

        movieRepository.save(movie);
        return modelMapper.map(movie, MovieDTO.class);
    }

}
