package com.hoangmp.imdb;

import com.hoangmp.imdb.models.*;
import com.hoangmp.imdb.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final EpisodeRepository episodeRepository;
    private final SeasonRepository seasonRepository;
    private final GenreRepository genreRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DirectorRepository directorRepository;
    private final ActorRepository actorRepository;

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

        Genre genre1 = new Genre();
        genre1.setName("Animation");
        genre1.setDescription("Animation is a form of visual storytelling that involves creating visual art and motion through the use of various techniques and technologies. In animation, images are manipulated to create the illusion of movement, bringing characters, objects, and environments to life. Animation can encompass a wide range of styles, themes, and intended audiences, making it a diverse and versatile form of storytelling.");

        Genre genre2 = new Genre();
        genre2.setName("Comedy");
        genre2.setDescription("The comedy genre refers to a category of entertainment that aims to amuse and entertain audiences by using humor, wit, and comedic situations. Comedies are created with the primary intention of eliciting laughter and providing lighthearted enjoyment. They encompass a wide range of styles, tones, and themes, appealing to various tastes and audiences.");

        genreRepository.save(genre1);
        genreRepository.save(genre2);

        Role role = new Role();
        role.setRoleName(AppRole.ROLE_ADMIN);

        roleRepository.save(role);

        Role role1 = new Role();
        role1.setRoleName(AppRole.ROLE_USER);

        roleRepository.save(role1);

        User newUser = new User();
        newUser.setUsername("hoangmp");
        newUser.setPassword(passwordEncoder.encode("password"));
        newUser.setPhoneNumber("0585424988");
        newUser.setRole(role);
        userRepository.save(newUser);

        User newUser1 = new User();
        newUser1.setUsername("user1");
        newUser1.setPassword(passwordEncoder.encode("password"));
        newUser1.setPhoneNumber("0585424988");
        newUser1.setRole(role1);
        userRepository.save(newUser1);

        Director director = new Director();
        director.setName("Todd White");
        director.setMovie(movie);
        director.setImageUrl("this is image");
        director.setIntroduction("Todd White was born on 10 October 1969 in San Antonio, Texas, USA. He is known for The SpongeBob SquarePants Movie (2004), The New Tom & Jerry Show (1975) and Freakazoid! (1995).");
        directorRepository.save(director);

        Actor actor = new Actor();
        actor.setName("Bob Deloes");
        actor.setImageUrl("this is image");
        actor.setIntroduction("Bob Deloes is known for The New Tom & Jerry Show (1975) and Tom & Jerry Kids Show (1990).");
        actorRepository.save(actor);
    }
}
