package com.hoangmp.imdb.payload.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenreRequest {
    private String name;
    private String description;
}
