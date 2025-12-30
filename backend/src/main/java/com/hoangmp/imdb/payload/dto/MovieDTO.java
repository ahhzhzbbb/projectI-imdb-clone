package com.hoangmp.imdb.payload.dto;

import com.hoangmp.imdb.models.MovieGenre;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Boolean tvSeries;
}
