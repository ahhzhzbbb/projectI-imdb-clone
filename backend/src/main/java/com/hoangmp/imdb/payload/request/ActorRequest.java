package com.hoangmp.imdb.payload.request;

import lombok.*;

@Getter
@Setter
public class ActorRequest {
    private String name;
    private String introduction;
    private String imageUrl;
}
