package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.models.Director;
import com.hoangmp.imdb.payload.dto.DirectorDTO;
import com.hoangmp.imdb.payload.request.DirectorRequest;
import com.hoangmp.imdb.payload.response.DirectorResponse;
import com.hoangmp.imdb.repositories.DirectorRepository;
import com.hoangmp.imdb.services.DirectorService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DirectorServiceImpl implements DirectorService {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private DirectorRepository directorRepository;

    @Override
    public DirectorDTO createDirector(DirectorRequest directorRequest) {
        Director newDirector = modelMapper.map(directorRequest, Director.class);
        Director addedDirector = directorRepository.save(newDirector);
        return modelMapper.map(addedDirector, DirectorDTO.class);
    }

    @Override
    public DirectorDTO removeDirector(Long directorId) {
        Director director = directorRepository.findById(directorId)
                .orElseThrow(() -> new ReflectiveOperationException("Director", "id", directorId));


    }

    @Override
    public DirectorResponse getAllDirectors() {
        return null;
    }
}
