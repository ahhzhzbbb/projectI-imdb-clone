package com.hoangmp.imdb.payload.response;

import com.hoangmp.imdb.payload.dto.MovieDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {
    private List<MovieDTO> movies;
}
