package com.hoangmp.imdb.payload.request;

import lombok.*;

@Getter
@Setter
public class MovieRequest {
    private String movieName;
    private String description;
    private String imageUrl;
    private String trailerUrl;
    private Boolean tvSeries;
    private Long directorId;
}
