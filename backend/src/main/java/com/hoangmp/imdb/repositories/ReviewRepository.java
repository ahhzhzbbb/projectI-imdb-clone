package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> getAllByMovieId(Long movieId);
}
