package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.dto.DirectorDTO;
import com.hoangmp.imdb.payload.request.DirectorRequest;
import com.hoangmp.imdb.payload.response.DirectorResponse;
import org.springframework.stereotype.Service;

@Service
public interface DirectorService {

    DirectorDTO createDirector(DirectorRequest directorRequest);

    DirectorDTO deleteDirector(Long directorId);

    DirectorResponse getAllDirectors();

    DirectorDTO updateDirector(Long id, DirectorRequest directorRequest);
}
