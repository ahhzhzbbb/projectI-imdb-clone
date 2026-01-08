package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.WishListDTO;
import com.hoangmp.imdb.payload.response.MovieResponse;
import com.hoangmp.imdb.security.service.UserDetailsImpl;
import com.hoangmp.imdb.services.WishListService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class WishListController {

    private final WishListService wishListService;

    @PermitAll
    @PostMapping("/wishlist/movie/{movieId}")
    public ResponseEntity<WishListDTO> addMovieToWishList (
        Authentication authentication,
        @PathVariable Long movieId
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        WishListDTO response = wishListService.addMovieToWishList(userId, movieId);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @DeleteMapping("/wishList/movie/{movieId}")
    public ResponseEntity<WishListDTO> removeMovieFromWishList (
            Authentication authentication,
            @PathVariable Long movieId
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        WishListDTO response = wishListService.removeMovieFromWishList(userId, movieId);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/wishList/movies")
    public ResponseEntity<MovieResponse> getUsersWishList(Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        MovieResponse response = wishListService.getMoviesFromWishList(userId);
        return ResponseEntity.ok().body(response);
    }
}
