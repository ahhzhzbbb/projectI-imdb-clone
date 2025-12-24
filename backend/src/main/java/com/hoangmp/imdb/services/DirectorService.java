package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.DirectorDTO;
import com.hoangmp.imdb.payload.request.DirectorRequest;
import com.hoangmp.imdb.payload.response.DirectorResponse;

public interface DirectorService {

    public DirectorDTO createDirector(DirectorRequest directorRequest);

    public DirectorDTO removeDirector(Long directorId);

    public DirectorResponse getAllDirectors();
}
