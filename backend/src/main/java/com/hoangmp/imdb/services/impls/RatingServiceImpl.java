package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Episode;
import com.hoangmp.imdb.models.Rating;
import com.hoangmp.imdb.models.User;
import com.hoangmp.imdb.payload.dto.RatingDTO;
import com.hoangmp.imdb.payload.request.RatingRequest;
import com.hoangmp.imdb.repositories.EpisodeRepository;
import com.hoangmp.imdb.repositories.RatingRepository;
import com.hoangmp.imdb.repositories.UserRepository;
import com.hoangmp.imdb.services.RatingService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RatingServiceImpl implements RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EpisodeRepository episodeRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    @Override
    public RatingDTO createRating(Long userId, Long episodeId, RatingRequest ratingRequest) {
        Rating rating = new Rating();
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "id", userId)
                );
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Episode", "id", episodeId)
                );

        Integer score = ratingRequest.getScore();

        rating.setUser(user);
        rating.setEpisode(episode);
        rating.setScore(score);
        Double averageScore = episode.getAverageScore();
        Integer count = episode.getRatingCount();
        averageScore = (averageScore * count + score) / (count + 1);
        count += 1;

        ratingRepository.save(rating);

        episode.setAverageScore(averageScore);
        episode.setRatingCount(count);

        episodeRepository.save(episode);

        return modelMapper.map(rating, RatingDTO.class);
    }

    @Transactional
    @Override
    public RatingDTO deleteRating(Long ratingId) {

        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Rating", "id", ratingId)
                );

        Episode episode = rating.getEpisode();
        int score = rating.getScore();

        int count = episode.getRatingCount();
        double averageScore = episode.getAverageScore();

        if (count <= 1) {
            episode.setRatingCount(0);
            episode.setAverageScore(0.0);
        } else {
            double newAverage =
                    (averageScore * count - score) / (count - 1);

            episode.setRatingCount(count - 1);
            episode.setAverageScore(newAverage);
        }

        ratingRepository.delete(rating);
        episodeRepository.save(episode);

        return modelMapper.map(rating, RatingDTO.class);
    }

    @Transactional
    @Override
    public RatingDTO updateRating(Long userId, Long episodeId, RatingRequest ratingRequest) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User", "id", userId)
                );
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Episode", "id", episodeId)
                );

        Rating rating = ratingRepository.findByUserAndEpisode(user, episode);

        if(rating == null) {
            throw new ResourceNotFoundException(
                    "Rating",
                    "userId & episodeId",
                    userId + ", " + episodeId
            );
        }

        Integer score = ratingRequest.getScore();

        Integer oldScore = rating.getScore();
        rating.setScore(score);
        Double averageScore = episode.getAverageScore();
        Integer count = episode.getRatingCount();
        averageScore = (averageScore * count - oldScore + score) / count;

        ratingRepository.save(rating);

        episode.setAverageScore(averageScore);
        episode.setRatingCount(count);

        episodeRepository.save(episode);

        return modelMapper.map(rating, RatingDTO.class);
    }
}
