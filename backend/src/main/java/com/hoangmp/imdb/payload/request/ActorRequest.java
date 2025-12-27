package com.hoangmp.imdb.payload.request;

import lombok.Data;

@Data
public class ActorRequest {
    private String name;
    private String introduction;
    private String imageUrl;
}
