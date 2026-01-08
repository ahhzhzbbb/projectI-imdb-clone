package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.User;
import com.hoangmp.imdb.models.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishListRepository extends JpaRepository<WishList, Long> {
    List<WishList> findByUser(User user);

    WishList findByUserAndMovie(User user, Movie movie);
}
