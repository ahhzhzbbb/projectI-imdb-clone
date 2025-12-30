package com.hoangmp.imdb.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeasonDetailDTO {
    private Long id;
    private Integer number;
    private List<EpisodeDTO> episodes;
}
