package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.Actor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActorRepository extends JpaRepository<Actor, Long> {
}
