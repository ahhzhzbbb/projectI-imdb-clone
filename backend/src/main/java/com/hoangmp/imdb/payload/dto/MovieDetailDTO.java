package com.hoangmp.imdb.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
    private List<SeasonDTO> seasons;
}
