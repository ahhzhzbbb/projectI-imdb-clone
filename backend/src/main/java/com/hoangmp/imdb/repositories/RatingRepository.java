package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.Rating;
import com.hoangmp.imdb.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Rating findByUserAndMovie(User user, Movie movie);
    boolean existsByUserAndMovie(User user, Movie movie);
}
