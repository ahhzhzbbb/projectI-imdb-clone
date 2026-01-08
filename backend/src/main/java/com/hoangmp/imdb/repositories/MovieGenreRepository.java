package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Genre;
import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.MovieGenre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieGenreRepository extends JpaRepository<MovieGenre, Long> {

    boolean existsByMovieAndGenre(Movie movie, Genre genre);

    List<MovieGenre> findByMovieId(Long movieId);

    List<MovieGenre> findByGenreId(Long genreId);

    MovieGenre findByMovieAndGenre(Movie movie, Genre genre);
}
