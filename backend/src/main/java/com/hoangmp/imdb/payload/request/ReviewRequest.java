package com.hoangmp.imdb.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {
    private Integer score;
    private Boolean isSpoiler;
    private String content;
}
