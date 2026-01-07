package com.hoangmp.imdb.payload.dto;

import lombok.*;

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
    private Double averageScore;
    private Integer ratingCount;
}
