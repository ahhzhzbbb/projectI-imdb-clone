package com.hoangmp.imdb.payload.request;

import lombok.*;

@Getter
@Setter
public class EpisodeRequest {
    private Integer episodeNumber;
    private String title;
    private String summary;
    private String posterURL;
    private String trailerURL;
}
