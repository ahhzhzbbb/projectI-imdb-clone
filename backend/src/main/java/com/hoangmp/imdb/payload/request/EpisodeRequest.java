package com.hoangmp.imdb.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EpisodeRequest {
    private Integer episodeNumber;
    private String title;
    private String summary;
    private String posterURL;
    private String trailerURL;
}
