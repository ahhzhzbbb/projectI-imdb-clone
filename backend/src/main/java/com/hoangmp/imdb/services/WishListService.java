package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.WishListDTO;
import com.hoangmp.imdb.payload.response.MovieResponse;

import java.util.List;

public interface WishListService {
    WishListDTO addMovieToWishList(Long userId, Long movieId);

    WishListDTO removeMovieFromWishList(Long userId, Long movieId);

    MovieResponse getMoviesFromWishList(Long userId);
}
