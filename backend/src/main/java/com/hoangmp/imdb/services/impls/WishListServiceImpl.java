package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.User;
import com.hoangmp.imdb.models.WishList;
import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.payload.dto.WishListDTO;
import com.hoangmp.imdb.payload.response.MovieResponse;
import com.hoangmp.imdb.repositories.MovieRepository;
import com.hoangmp.imdb.repositories.UserRepository;
import com.hoangmp.imdb.repositories.WishListRepository;
import com.hoangmp.imdb.services.WishListService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishListServiceImpl implements WishListService {

    private final WishListRepository wishListRepository;

    private final UserRepository userRepository;

    private final MovieRepository movieRepository;

    private final ModelMapper modelMapper;

    @Transactional
    @Override
    public WishListDTO addMovieToWishList(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "id", userId)
                );
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie", "id", movieId)
                );

        WishList wishList = new WishList();
        wishList.setUser(user);
        wishList.setMovie(movie);
        wishListRepository.save(wishList);
        return modelMapper.map(wishList, WishListDTO.class);
    }

    @Transactional
    @Override
    public WishListDTO removeMovieFromWishList(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "id", userId)
                );
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie", "id", movieId)
                );
        WishList wishList = wishListRepository.findByUserAndMovie(user, movie);
        wishListRepository.delete(wishList);
        return modelMapper.map(wishList, WishListDTO.class);
    }

    @Override
    public MovieResponse getMoviesFromWishList(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "id", userId)
                );
        List<WishList> wishLists = wishListRepository.findByUser(user);

        List<MovieDTO> movies = wishLists.stream()
                .map(WishList::getMovie)
                .map(movie -> modelMapper.map(movie, MovieDTO.class))
                .toList();
        return new MovieResponse(movies);
    }
}
