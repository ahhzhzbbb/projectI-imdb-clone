package com.hoangmp.imdb.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
