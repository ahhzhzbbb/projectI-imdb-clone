package com.hoangmp.imdb.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieActorDTO {
    private Long id;
    private Long movieId;
    private Long actorId;
}
