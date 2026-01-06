package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Actor;
import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.MovieActor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieActorRepository extends JpaRepository<MovieActor, Long> {
    boolean existsByMovieAndActor(Movie movie, Actor actor);

    List<MovieActor> findByMovieId(Long movieId);

    List<MovieActor> findByActorId(Long actorId);

    MovieActor findByMovieAndActor(Movie movie, Actor actor);
}
