package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.GenreDTO;
import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.MovieGenreDTO;

import java.util.List;

public interface MovieGenreService {
    public MovieGenreDTO addGenreToMovie(Long movieId, Long genreId);

    public MovieGenreDTO removeGenreFromMovie(Long movieId, Long genreId);

    public List<GenreDTO> getGenresOfMovie(Long movieId);

    public List<MovieDTO> getMoviesOfGenre(Long genreId);
}
