package com.harp.backend.entities.grupo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IGrupoRepository extends JpaRepository<Grupo, Long> {
}
