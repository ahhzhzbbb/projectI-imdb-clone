package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Season;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeasonRepository extends JpaRepository<Season, Long> {
}
