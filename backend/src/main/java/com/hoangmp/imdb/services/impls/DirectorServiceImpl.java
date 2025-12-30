package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Director;
import com.hoangmp.imdb.payload.dto.DirectorDTO;
import com.hoangmp.imdb.payload.request.DirectorRequest;
import com.hoangmp.imdb.payload.response.DirectorResponse;
import com.hoangmp.imdb.repositories.DirectorRepository;
import com.hoangmp.imdb.services.DirectorService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DirectorServiceImpl implements DirectorService {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private DirectorRepository directorRepository;

    @Override
    public DirectorDTO createDirector(DirectorRequest directorRequest) {
        Director newDirector = modelMapper.map(directorRequest, Director.class);
        directorRepository.save(newDirector);
        DirectorDTO response = modelMapper.map(newDirector, DirectorDTO.class);
        return response;
    }

    @Override
    public DirectorDTO deleteDirector(Long directorId) {

        Director director = directorRepository.findById(directorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Director", "id", directorId)
                );


        directorRepository.delete(director);

        return modelMapper.map(director, DirectorDTO.class);
    }

    @Override
    public DirectorResponse getAllDirectors() {
        List<Director> directors = directorRepository.findAll();
        List<DirectorDTO> directorDTOList = directors.stream()
                .map(director -> modelMapper.map(director, DirectorDTO.class))
                .toList();
        DirectorResponse response = new DirectorResponse();
        response.setDirectors(directorDTOList);
        return response;
    }

    @Override
    public DirectorDTO updateDirector(Long directorId, DirectorRequest directorRequest) {
        Director director = directorRepository.findById(directorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Director", "id", directorId)
                );
        modelMapper.map(directorRequest, director);
        Director updatedDirector = directorRepository.save(director);
        return modelMapper.map(updatedDirector, DirectorDTO.class);
    }
}
