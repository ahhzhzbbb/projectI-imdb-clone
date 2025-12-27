package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Director;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DirectorRepository extends JpaRepository<Director, Long> {
}
