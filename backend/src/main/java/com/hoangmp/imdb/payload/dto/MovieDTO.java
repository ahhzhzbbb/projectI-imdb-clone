package com.hoangmp.imdb.payload.dto;

import com.hoangmp.imdb.models.MovieGenre;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Boolean tvSeries;
    private Set<MovieGenre> movieGenres;
}
