package com.hoangmp.imdb.payload.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {
    private Long userId;
    private Long episodeId;
    private Integer score;
}
