package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Actor;
import com.hoangmp.imdb.models.Movie;
import com.hoangmp.imdb.models.MovieActor;
import com.hoangmp.imdb.payload.dto.ActorDTO;
import com.hoangmp.imdb.payload.dto.MovieActorDTO;
import com.hoangmp.imdb.payload.dto.MovieDTO;
import com.hoangmp.imdb.repositories.ActorRepository;
import com.hoangmp.imdb.repositories.MovieActorRepository;
import com.hoangmp.imdb.repositories.MovieRepository;
import com.hoangmp.imdb.services.MovieActorService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MovieActorServiceImpl implements MovieActorService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ActorRepository actorRepository;

    @Autowired
    private MovieActorRepository movieActorRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    @Override
    public MovieActorDTO addActorToMovie(Long actorId, Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie", "id", movieId)
                );

        Actor actor = actorRepository.findById(actorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Actor", "id", actorId)
                );

        if(movieActorRepository.existsByMovieAndActor(movie, actor)) {
            throw new IllegalStateException("Dien vien nay da duoc them vao");
        }

        MovieActor movieActor = new MovieActor();
        movieActor.setActor(actor);
        movieActor.setMovie(movie);
        MovieActor newMovieActor = movieActorRepository.save(movieActor);
        return modelMapper.map(newMovieActor, MovieActorDTO.class);
    }

    @Transactional
    @Override
    public MovieActorDTO removeActorFromMovie(Long movieId, Long actorId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Movie", "id", movieId)
                );
        Actor actor = actorRepository.findById(actorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Actor", "id", actorId)
                );

        MovieActor movieActor = movieActorRepository.findByMovieAndActor(movie, actor);
        movieActorRepository.delete(movieActor);
        return modelMapper.map(movieActor, MovieActorDTO.class);
    }

    @Override
    public List<ActorDTO> getActorsOfMovie(Long movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new ResourceNotFoundException("Movie", "id", movieId);
        }

        List<MovieActor> movieActors =
                movieActorRepository.findByMovieId(movieId);

        return movieActors.stream()
                .map(MovieActor::getActor)
                .map(actor -> modelMapper.map(actor, ActorDTO.class))
                .toList();
    }

    @Override
    public List<MovieDTO> getMoviesOfActor(Long actorId) {
        if(!actorRepository.existsById(actorId)) {
            throw new ResourceNotFoundException("Actor", "id", actorId);
        }

        List<MovieActor> movieActors =
                movieActorRepository.findByActorId(actorId);

        return movieActors.stream()
                .map(MovieActor::getMovie)
                .map(movie -> modelMapper.map(movie, MovieDTO.class))
                .toList();
    }
}
