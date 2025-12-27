package com.hoangmp.imdb.payload.response;

import com.hoangmp.imdb.payload.dto.SeasonDTO;
import lombok.Data;

import java.util.List;

@Data
public class SeasonResponse {
    private List<SeasonDTO> seasonDTOList;
}
