package com.hoangmp.imdb.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DirectorRequest {
    private String name;
    private String introduction;
    private String imageUrl;
}
