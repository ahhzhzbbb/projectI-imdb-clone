package com.hoangmp.imdb.payload.dto;

import lombok.Data;

@Data
public class ActorDTO {
    private Long id;
    private String name;
    private String introduction;
    private String imageUrl;
}
