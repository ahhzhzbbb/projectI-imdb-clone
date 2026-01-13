package com.hoangmp.imdb.payload.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EpisodeDTO {
    private Long id;
    private Integer episodeNumber;
    private String title;
    private String summary;
    private String posterURL;
    private String trailerURL;
    private Double averageScore;
    private Integer ratingCount;
}
