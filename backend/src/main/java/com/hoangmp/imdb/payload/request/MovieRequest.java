package com.hoangmp.imdb.payload.request;

import com.hoangmp.imdb.models.MovieGenre;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieRequest {
    private String movieName;
    private String description;
    private String imageUrl;
    private String trailerUrl;
    private Boolean tvSeries;
}
