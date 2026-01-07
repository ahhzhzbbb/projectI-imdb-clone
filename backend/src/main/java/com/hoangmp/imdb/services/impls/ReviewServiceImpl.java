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
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ModelMapper modelMapper;

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
        return modelMapper.map(newReview, ReviewDTO.class);
    }

    @Transactional
    @Override
    public ReviewDTO deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Review", "id", reviewId)
                );

        Movie movie = review.getMovie();
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
        return modelMapper.map(review, ReviewDTO.class);
    }

    @Transactional
    @Override
    public ReviewDTO updateReview(Long reviewId, ReviewRequest reviewRequest) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Review", "id", reviewId)
                );

        Integer oldScore = review.getScore();
        modelMapper.map(reviewRequest, review);
        Integer newScore = review.getScore();
        Movie movie = review.getMovie();
        if(!Objects.equals(oldScore, newScore)) {
            Integer count = movie.getReviewCount();
            Double averageScore = movie.getAverageScore();
            averageScore = (averageScore * count - oldScore + newScore) / count;
            movie.setAverageScore(averageScore);
        }
        movieRepository.save(movie);
        reviewRepository.save(review);
        return modelMapper.map(review, ReviewDTO.class);
    }

    @Override
    public ReviewResponse getReviewsFromMovie(Long movieId) {
        List<Review> reviews = reviewRepository.getAllByMovieId(movieId);
        List<ReviewDTO> reviewDTOS = reviews.stream()
                .map(review -> modelMapper.map(review, ReviewDTO.class))
                .toList();

        ReviewResponse reviewResponse = new ReviewResponse();
        reviewResponse.setReviews(reviewDTOS);

        return reviewResponse;
    }
}
