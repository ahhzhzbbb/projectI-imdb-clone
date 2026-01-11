package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.ActorDTO;
import com.hoangmp.imdb.payload.request.ActorRequest;
import com.hoangmp.imdb.payload.response.ActorResponse;

public interface ActorService {

    ActorDTO createActor(ActorRequest actorRequest);

    ActorDTO deleteActor(Long actorId);

    ActorResponse getAllActors();

    ActorDTO updateActor(Long actorId, ActorRequest actorRequest);

    ActorDTO getActor(Long actorId);
}
