package com.hoangmp.imdb.services.impls;

import com.hoangmp.imdb.exceptions.ResourceNotFoundException;
import com.hoangmp.imdb.models.Genre;
import com.hoangmp.imdb.payload.dto.GenreDTO;
import com.hoangmp.imdb.payload.request.GenreRequest;
import com.hoangmp.imdb.payload.response.GenreResponse;
import com.hoangmp.imdb.repositories.GenreRepository;
import com.hoangmp.imdb.services.GenreService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;

    private final ModelMapper modelMapper;

    @Transactional
    @Override
    public GenreDTO createGenre(GenreRequest genreRequest) {
        Genre newGenre = new Genre();
        modelMapper.map(genreRequest, newGenre);
        genreRepository.save(newGenre);
        return modelMapper.map(newGenre, GenreDTO.class);
    }

    @Transactional
    @Override
    public GenreDTO deleteGenre(Long genreId) {
        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new ResourceNotFoundException("Genre", "id", genreId)
        );
        genreRepository.delete(genre);
        return modelMapper.map(genre, GenreDTO.class);
    }

    @Override
    public GenreResponse getAllGenre() {
        List<Genre> genreList = genreRepository.findAll();
        List<GenreDTO> genreDTOList = genreList.stream()
                .map(genre -> modelMapper.map(genre, GenreDTO.class))
                .toList();
        GenreResponse genreResponse = new GenreResponse();
        genreResponse.setGenres(genreDTOList);
        return genreResponse;
    }
}
