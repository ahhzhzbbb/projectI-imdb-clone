package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Episode;
import com.hoangmp.imdb.models.Rating;
import com.hoangmp.imdb.models.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RatingRepository extends JpaRepository<Rating, Long> {
    Rating findByUserAndEpisode(User user, Episode episode);
    //boolean existsByUserAndEpisode(User user, Episode episode);
}
