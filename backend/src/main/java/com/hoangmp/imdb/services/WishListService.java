package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.WishListDTO;
import com.hoangmp.imdb.payload.response.MovieResponse;

public interface WishListService {
    WishListDTO addMovieToWishList(Long userId, Long movieId);

    WishListDTO removeMovieFromWishList(Long userId, Long movieId);

    MovieResponse getMoviesFromWishList(Long userId);
}
