package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.request.MovieRequest;
import com.hoangmp.imdb.payload.response.MovieResponse;
import com.hoangmp.imdb.repositories.MovieRepository;
import com.hoangmp.imdb.services.MovieService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieServiceImpl implements MovieService {
    @Autowired
    public ModelMapper modelMapper;

    @Autowired
    public MovieRepository movieRepository;

    @Override
    public MovieDTO createMovie(MovieRequest movieRequest) {
        Movie newMovie = modelMapper.map(movieRequest, Movie.class);
        movieRepository.save(newMovie);
        MovieDTO response = modelMapper.map(newMovie, MovieDTO.class);
        return response;
    }

    @Override
    public MovieResponse getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        List<MovieDTO> movieList = movies.stream()
                .map(movie -> modelMapper.map(movie, MovieDTO.class))
                .toList();
        MovieResponse movieResponse = new MovieResponse();
        movieResponse.setMovies(movieList);
        return movieResponse;
    }

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
