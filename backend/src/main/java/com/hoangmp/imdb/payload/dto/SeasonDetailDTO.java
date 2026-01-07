package com.hoangmp.imdb.payload.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeasonDetailDTO {
    private Long id;
    private Integer number;
    private List<EpisodeDTO> episodes;
}
