package com.hoangmp.imdb.payload.request;

import lombok.*;

@Getter
@Setter
public class DirectorRequest {
    private String name;
    private String introduction;
    private String imageUrl;
}
