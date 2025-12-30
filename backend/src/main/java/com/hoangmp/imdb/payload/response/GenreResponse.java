package com.hoangmp.imdb.payload.response;

import com.hoangmp.imdb.payload.dto.GenreDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class GenreResponse {
    List<GenreDTO> genres;
}
