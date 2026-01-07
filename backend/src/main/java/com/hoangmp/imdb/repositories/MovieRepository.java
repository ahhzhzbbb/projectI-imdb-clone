package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {

}
