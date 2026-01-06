package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.ActorDTO;
import com.hoangmp.imdb.payload.dto.MovieActorDTO;
import com.hoangmp.imdb.payload.dto.MovieDTO;

import java.util.List;

public interface MovieActorService {
    public MovieActorDTO addActorToMovie(Long actorId, Long movieId);

    public MovieActorDTO removeActorFromMovie(Long movieId, Long actorId);

    public List<ActorDTO> getActorsOfMovie(Long movieId);

    public List<MovieDTO> getMoviesOfActor(Long actorId);
}
