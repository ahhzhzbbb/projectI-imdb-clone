package com.hoangmp.imdb.payload.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DirectorDTO {
    private Long id;
    private String name;
    private String introduction;
    private String imageUrl;
}
