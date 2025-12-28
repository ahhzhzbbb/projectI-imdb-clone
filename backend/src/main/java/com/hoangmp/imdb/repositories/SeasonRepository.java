package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Season;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SeasonRepository extends JpaRepository<Season, Long> {
}
