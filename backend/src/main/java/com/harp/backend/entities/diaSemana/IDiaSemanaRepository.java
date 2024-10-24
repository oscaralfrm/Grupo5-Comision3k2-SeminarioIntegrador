package com.harp.backend.entities.diaSemana;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IDiaSemanaRepository extends JpaRepository<DiaSemana, Long> {
    Optional<DiaSemana> findByNombre(String nombre);
}
