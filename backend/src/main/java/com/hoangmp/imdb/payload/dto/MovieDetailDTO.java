package com.hoangmp.imdb.payload.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieDetailDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String trailerUrl;
    private Boolean tvSeries;
    private Double averageScore;
    private Integer ratingCount;
    private List<SeasonDetailDTO> seasons;
    private DirectorDTO director;
}
