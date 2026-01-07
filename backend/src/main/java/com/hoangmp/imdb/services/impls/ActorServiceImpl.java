package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Actor;
import com.hoangmp.imdb.payload.dto.ActorDTO;
import com.hoangmp.imdb.payload.request.ActorRequest;
import com.hoangmp.imdb.payload.response.ActorResponse;
import com.hoangmp.imdb.repositories.ActorRepository;
import com.hoangmp.imdb.services.ActorService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActorServiceImpl implements ActorService {

    private final ModelMapper modelMapper;

    private final ActorRepository actorRepository;

    @Transactional
    @Override
    public ActorDTO createActor(ActorRequest actorRequest ) {
        Actor newActor = modelMapper.map(actorRequest, Actor.class);
        actorRepository.save(newActor);
        return modelMapper.map(newActor, ActorDTO.class);
    }

    @Transactional
    @Override
    public ActorDTO deleteActor(Long actorId) {
        Actor actor = actorRepository.findById(actorId)
                .orElseThrow(() -> new ResourceNotFoundException("Actor", "id", actorId));

        actorRepository.delete(actor);
        return modelMapper.map(actor, ActorDTO.class);
    }

    @Override
    public ActorResponse getAllActors() {
        List<Actor> actorList = actorRepository.findAll();
        List<ActorDTO> actorDTOList = actorList.stream()
                .map(actor -> modelMapper.map(actor, ActorDTO.class))
                .toList();

        ActorResponse response = new ActorResponse();
        response.setActors(actorDTOList);
        return response;
    }

    @Transactional
    @Override
    public ActorDTO updateActor(Long actorId, ActorRequest actorRequest) {
        Actor actor = actorRepository.findById(actorId)
                .orElseThrow(() -> new ResourceNotFoundException("Actor", "id", actorId));
        modelMapper.map(actorRequest, actor);
        Actor updatedActor = actorRepository.save(actor);
        return modelMapper.map(updatedActor, ActorDTO.class);
    }
}
