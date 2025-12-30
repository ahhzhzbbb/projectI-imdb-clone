package com.hoangmp.imdb;

import com.hoangmp.imdb.models.Episode;
import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.Season;
import com.hoangmp.imdb.repositories.EpisodeRepository;
import com.hoangmp.imdb.repositories.MovieRepository;
import com.hoangmp.imdb.repositories.SeasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final EpisodeRepository episodeRepository;
    private final SeasonRepository seasonRepository;
//    private final SeasonRepository seasonRepository;

    @Override
    public void run(String... args) {
        if (movieRepository.count() > 0) return;

        Movie movie = new Movie();
        movie.setName("The New Tom & Jerry Show");
        movie.setDescription("A modern continuation of the original Tom and Jerry cartoon, where the cat-and-mouse duo are now close friends through a series of adventures and chaos.");
        movie.setImageUrl("https://m.media-amazon.com/images/M/MV5BY2M1Mzc5NGItZmM0Yi00NDUzLWExYzUtMDlmZmFiM2Q0NDZmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg");
        movie.setTvSeries(true);

        movieRepository.save(movie);

        for (int i = 1; i <= 3; i++) {
            Season season = new Season();
            season.setNumber(i);
            season.setMovie(movie);
            movie.getSeasons().add(season);
            seasonRepository.save(season);
        }

        movieRepository.save(movie);

        Episode episode = new Episode();
        episode.setEpisodeNumber(1);
        episode.setTitle("No Way, Stowaways/The Ski Bunny/Stay Awake or Else...");
        episode.setSummary("No Way, Stowaways: Caught stowing away on a pirate ship, Tom and Jerry compete to become the ship's cabin boy and avoid being thrown overboard by Weirdbeard the Pirate. The Ski Bunny: While skiing in the Swiss Alps, Tom and Jerry compete for the affections of a pretty female cat, and try not to get into trouble with Spike. Stay Awake or Else...: After partying all night, circus roustabout Tom can't stay awake on the job; Jerry tries to keep him from being fired by the ringmaster.");
        episode.setPosterURL("null");
        episode.setTrailerURL("https://www.youtube.com/watch?v=-2wpwfR9zLA");
        episode.setSeason(movie.getSeasons().getFirst());

        episodeRepository.save(episode);
    }
}
