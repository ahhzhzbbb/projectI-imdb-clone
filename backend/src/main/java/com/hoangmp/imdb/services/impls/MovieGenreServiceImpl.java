package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Genre;
import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.MovieGenre;
import com.hoangmp.imdb.payload.dto.GenreDTO;
import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.MovieGenreDTO;
import com.hoangmp.imdb.repositories.GenreRepository;
import com.hoangmp.imdb.repositories.MovieGenreRepository;
import com.hoangmp.imdb.repositories.MovieRepository;
import com.hoangmp.imdb.services.MovieGenreService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieGenreServiceImpl implements MovieGenreService {

    private final MovieRepository movieRepository;

    private final GenreRepository genreRepository;

    private final MovieGenreRepository movieGenreRepository;

    private final ModelMapper modelMapper;

    @Transactional
    @Override
    public MovieGenreDTO addGenreToMovie(Long movieId, Long genreId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie", "id", movieId)
                );

        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Genre", "id", genreId)
                );

        if (movieGenreRepository.existsByMovieAndGenre(movie, genre)) {
            throw new IllegalStateException("The loai nay da duoc them vao");
        }

        MovieGenre movieGenre = new MovieGenre();
        movieGenre.setGenre(genre);
        movieGenre.setMovie(movie);
        MovieGenre newMovieGenre = movieGenreRepository.save(movieGenre);
        return modelMapper.map(newMovieGenre, MovieGenreDTO.class);
    }

    @Transactional
    @Override
    public MovieGenreDTO removeGenreFromMovie(Long movieId, Long genreId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie", "id", movieId)
                );

        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Genre", "id", genreId)
                );
        MovieGenre movieGenre = movieGenreRepository.findByMovieAndGenre(movie, genre);
        movieGenreRepository.delete(movieGenre);
        return modelMapper.map(movieGenre, MovieGenreDTO.class);
    }


    @Override
    public List<GenreDTO> getGenresOfMovie(Long movieId) {

        if (!movieRepository.existsById(movieId)) {
            throw new ResourceNotFoundException("Movie", "id", movieId);
        }

        List<MovieGenre> movieGenres =
                movieGenreRepository.findByMovieId(movieId);

        return movieGenres.stream()
                .map(MovieGenre::getGenre)
                .map(genre -> modelMapper.map(genre, GenreDTO.class))
                .toList();
    }


    @Override
    public List<MovieDTO> getMoviesOfGenre(Long genreId) {
        if (!genreRepository.existsById(genreId)) {
            throw new ResourceNotFoundException("Genre", "id", genreId);
        }

        List<MovieGenre> movieGenres =
                movieGenreRepository.findByGenreId(genreId);

        return movieGenres.stream()
                .map(MovieGenre::getMovie)
                .map(movie -> modelMapper.map(movie, MovieDTO.class))
                .toList();
    }
}
