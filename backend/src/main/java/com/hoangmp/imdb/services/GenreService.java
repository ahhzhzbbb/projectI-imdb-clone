package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.GenreDTO;
import com.hoangmp.imdb.payload.request.GenreRequest;
import com.hoangmp.imdb.payload.response.GenreResponse;

public interface GenreService {
    GenreDTO createGenre(GenreRequest genreRequest);

    GenreDTO deleteGenre(Long genreId);

    GenreResponse getAllGenre();
}
