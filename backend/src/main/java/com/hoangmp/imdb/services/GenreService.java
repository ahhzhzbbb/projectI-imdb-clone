package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.GenreDTO;
import com.hoangmp.imdb.payload.request.GenreRequest;
import com.hoangmp.imdb.payload.response.GenreResponse;

public interface GenreService {
    public GenreDTO createGenre(GenreRequest genreRequest);

    public GenreDTO deleteGenre(Long genreId);

    public GenreResponse getAllGenre();
}
