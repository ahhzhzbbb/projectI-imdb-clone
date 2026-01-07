package com.hoangmp.imdb.payload.response;

import com.hoangmp.imdb.payload.dto.ReviewDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ReviewResponse {
    List<ReviewDTO> reviews;
}
