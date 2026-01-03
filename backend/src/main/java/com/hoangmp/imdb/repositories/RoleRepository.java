package com.hoangmp.imdb.repositories;

import com.hoangmp.imdb.models.AppRole;
import com.hoangmp.imdb.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(AppRole appRole);
}
