package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.Rating;
import com.hoangmp.imdb.models.User;
import com.hoangmp.imdb.payload.dto.RatingDTO;
import com.hoangmp.imdb.repositories.MovieRepository;
import com.hoangmp.imdb.repositories.RatingRepository;
import com.hoangmp.imdb.repositories.UserRepository;
import com.hoangmp.imdb.services.RatingService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RatingServiceImpl implements RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RatingDTO createRating(Long userId, Long movieId, Integer score) {
        Rating rating = new Rating();
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "id", userId)
                );
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Moive", "id", movieId)
                );
        rating.setUser(user);
        rating.setMovie(movie);
        rating.setScore(score);
        Double averageScore = movie.getAverageScore();
        Integer count = movie.getRatingCount();
        averageScore = (averageScore * count + score) / (count + 1);
        count += 1;

        ratingRepository.save(rating);

        movie.setAverageScore(averageScore);
        movie.setRatingCount(count);

        movieRepository.save(movie);

        return modelMapper.map(rating, RatingDTO.class);
    }

    @Override
    public RatingDTO deleteRating(Long ratingId) {

        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Rating", "id", ratingId)
                );

        Movie movie = rating.getMovie();
        int score = rating.getScore();

        int count = movie.getRatingCount();
        double averageScore = movie.getAverageScore();

        if (count <= 1) {
            movie.setRatingCount(0);
            movie.setAverageScore(0.0);
        } else {
            double newAverage =
                    (averageScore * count - score) / (count - 1);

            movie.setRatingCount(count - 1);
            movie.setAverageScore(newAverage);
        }

        ratingRepository.delete(rating);
        movieRepository.save(movie);

        return modelMapper.map(rating, RatingDTO.class);
    }

    @Override
    public RatingDTO updateRating(Long userId, Long movieId, Integer score) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "id", userId)
                );
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Moive", "id", movieId)
                );

        Rating rating = ratingRepository.findByUserAndMovie(user, movie);

        if(rating == null) {
            throw new ResourceNotFoundException(
                    "Rating",
                    "userId & movieId",
                    userId + ", " + movieId
            );
        }

        Integer oldScore = rating.getScore();
        rating.setScore(score);
        Double averageScore = movie.getAverageScore();
        Integer count = movie.getRatingCount();
        averageScore = (averageScore * count - oldScore + score) / count;

        ratingRepository.save(rating);
        ratingRepository.save(rating);

        movie.setAverageScore(averageScore);
        movie.setRatingCount(count);

        movieRepository.save(movie);

        return modelMapper.map(rating, RatingDTO.class);
    }


}
