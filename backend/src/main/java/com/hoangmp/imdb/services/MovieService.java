package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.MovieDetailDTO;
import com.hoangmp.imdb.payload.request.MovieRequest;
import com.hoangmp.imdb.payload.response.MovieResponse;
import org.springframework.stereotype.Service;

@Service
public interface MovieService {
    MovieDTO createMovie(MovieRequest movieRequest);

    MovieResponse getAllMovies();

    MovieDetailDTO getMovieDetail(Long movieId);

    MovieDTO deleteMovie(Long movieId);
}
