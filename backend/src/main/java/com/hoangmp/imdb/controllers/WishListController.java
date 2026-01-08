package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.WishListDTO;
import com.hoangmp.imdb.payload.response.MovieResponse;
import com.hoangmp.imdb.security.service.UserDetailsImpl;
import com.hoangmp.imdb.services.WishListService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/*
    * Wish List Controller
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class WishListController {

    private final WishListService wishListService;

    /* API thêm phim vào wish list của người dùng */
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

    /* API xóa phim khỏi wish list của người dùng */
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

    /* API lấy tất cả phim trong wish list của người dùng */
    @PermitAll
    @GetMapping("/wishList/movies")
    public ResponseEntity<MovieResponse> getUsersWishList(Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();
        MovieResponse response = wishListService.getMoviesFromWishList(userId);
        return ResponseEntity.ok().body(response);
    }
}
