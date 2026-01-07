package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.GenreDTO;
import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.MovieGenreDTO;

import java.util.List;

public interface MovieGenreService {
    MovieGenreDTO addGenreToMovie(Long movieId, Long genreId);

    MovieGenreDTO removeGenreFromMovie(Long movieId, Long genreId);

    List<GenreDTO> getGenresOfMovie(Long movieId);

    List<MovieDTO> getMoviesOfGenre(Long genreId);
}
