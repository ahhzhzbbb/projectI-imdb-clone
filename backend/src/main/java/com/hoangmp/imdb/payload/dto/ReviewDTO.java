package com.hoangmp.imdb.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Integer score;
    private Boolean isSpoiler;
    private String content;
    private LocalDate createdAt;
    private Long userId;
    private Long movieId;
}
