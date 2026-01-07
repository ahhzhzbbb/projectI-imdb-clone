package com.hoangmp.imdb.payload.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieActorDTO {
    private Long id;
    private Long movieId;
    private Long actorId;
}
