package com.hoangmp.imdb.payload.response;

import com.hoangmp.imdb.models.Director;
import com.hoangmp.imdb.payload.dto.DirectorDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DirectorResponse {
    List<DirectorDTO> directorDTOList;
}
