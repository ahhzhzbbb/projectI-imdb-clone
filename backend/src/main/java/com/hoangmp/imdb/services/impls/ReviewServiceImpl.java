package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.Review;
import com.hoangmp.imdb.models.User;
import com.hoangmp.imdb.payload.dto.ReviewDTO;
import com.hoangmp.imdb.payload.request.ReviewRequest;
import com.hoangmp.imdb.payload.response.ReviewResponse;
import com.hoangmp.imdb.repositories.MovieRepository;
import com.hoangmp.imdb.repositories.ReviewRepository;
import com.hoangmp.imdb.repositories.UserRepository;
import com.hoangmp.imdb.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    private final UserRepository userRepository;

    private final MovieRepository movieRepository;

    private final ModelMapper modelMapper;

    @Transactional
    @Override
    public ReviewDTO createReview(Long userId, Long movieId, ReviewRequest reviewRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "id", userId)
                );
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie", "id", movieId)
                );

        Review newReview = new Review();
        modelMapper.map(reviewRequest, newReview);
        newReview.setUser(user);
        newReview.setMovie(movie);

        Integer score = newReview.getScore();
        Integer count = movie.getReviewCount();
        Double averageScore = movie.getAverageScore();

        averageScore = (averageScore * count + score) / (count + 1);
        count ++;
        movie.setAverageScore(averageScore);
        movie.setReviewCount(count);

        reviewRepository.save(newReview);
        movieRepository.save(movie);
        ReviewDTO reviewDTO = new ReviewDTO();
        modelMapper.map(newReview, reviewDTO);
        reviewDTO.setUsername(user.getUsername());
        return reviewDTO;
    }

    @Transactional
    @Override
    public ReviewDTO removeReview(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "id", userId)
                );
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie", "id", movieId)
                );

        Review review = reviewRepository.findByUserAndMovie(user, movie);

        Integer count = movie.getReviewCount();
        Double averageScore = movie.getAverageScore();

        if(count <= 1) {
            movie.setAverageScore(0.0);
            movie.setReviewCount(0);
        }
        else {
            Integer score = review.getScore();

            averageScore = (averageScore * count - score) / (count - 1);
            count --;
            movie.setAverageScore(averageScore);
            movie.setReviewCount(count);
        }

        movieRepository.save(movie);
        reviewRepository.delete(review);
        ReviewDTO reviewDTO = new ReviewDTO();
        modelMapper.map(review, reviewDTO);
        reviewDTO.setUsername(user.getUsername());
        return reviewDTO;
    }

    @Transactional
    @Override
    public ReviewDTO updateReview(Long userId, Long movieId, ReviewRequest reviewRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "id", userId)
                );
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie", "id", movieId)
                );

        Review review = reviewRepository.findByUserAndMovie(user, movie);

        Integer oldScore = review.getScore();
        modelMapper.map(reviewRequest, review);
        Integer newScore = review.getScore();
        if(!Objects.equals(oldScore, newScore)) {
            Integer count = movie.getReviewCount();
            Double averageScore = movie.getAverageScore();
            averageScore = (averageScore * count - oldScore + newScore) / count;
            movie.setAverageScore(averageScore);
        }
        movieRepository.save(movie);
        reviewRepository.save(review);
        ReviewDTO reviewDTO = new ReviewDTO();
        modelMapper.map(review, reviewDTO);
        reviewDTO.setUsername(user.getUsername());
        return reviewDTO;
    }

    @Override
    public ReviewResponse getReviewsFromMovie(Long movieId) {
        List<Review> reviews = reviewRepository.getAllByMovieId(movieId);

        List<ReviewDTO> reviewDTOS = reviews.stream().map(review -> {
            ReviewDTO dto = modelMapper.map(review, ReviewDTO.class);
            dto.setUsername(review.getUser().getUsername());
            return dto;
        }).toList();

        ReviewResponse response = new ReviewResponse();
        response.setReviews(reviewDTOS);
        return response;
    }
}
