package com.hoangmp.imdb.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EpisodeDTO {
    private Long id;
    private Integer episodeNumber;
    private String title;
    private String posterURL;
    private String trailerURL;
}
