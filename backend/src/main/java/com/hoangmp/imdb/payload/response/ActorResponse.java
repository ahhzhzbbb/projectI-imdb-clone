package com.hoangmp.imdb.payload.response;

import com.hoangmp.imdb.payload.dto.ActorDTO;
import lombok.Data;

import java.util.List;

@Data
public class ActorResponse {
    List<ActorDTO> actorDTOList;
}
