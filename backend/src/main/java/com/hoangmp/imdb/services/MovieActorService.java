package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.ActorDTO;
import com.hoangmp.imdb.payload.dto.MovieActorDTO;
import com.hoangmp.imdb.payload.dto.MovieDTO;

import java.util.List;

public interface MovieActorService {
    MovieActorDTO addActorToMovie(Long actorId, Long movieId);

    MovieActorDTO removeActorFromMovie(Long movieId, Long actorId);

    List<ActorDTO> getActorsOfMovie(Long movieId);

    List<MovieDTO> getMoviesOfActor(Long actorId);
}
