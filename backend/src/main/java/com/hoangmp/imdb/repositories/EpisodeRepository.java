package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Episode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EpisodeRepository extends JpaRepository<Episode, Long> {
}
