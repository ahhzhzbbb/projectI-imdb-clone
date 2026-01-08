package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.Review;
import com.hoangmp.imdb.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> getAllByMovieId(Long movieId);

    Review findByUserAndMovie(User user, Movie movie);
}
