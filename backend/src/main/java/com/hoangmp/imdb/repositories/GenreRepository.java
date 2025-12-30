package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre, Long> {
}
