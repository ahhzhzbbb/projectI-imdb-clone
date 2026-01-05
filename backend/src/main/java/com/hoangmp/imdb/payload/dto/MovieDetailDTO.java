package com.hoangmp.imdb.payload.dto;

import com.hoangmp.imdb.models.MovieGenre;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
}
