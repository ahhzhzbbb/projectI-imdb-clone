package com.hoangmp.imdb.payload.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GenreDTO {
    private Long id;
    private String name;
    private String description;
}
