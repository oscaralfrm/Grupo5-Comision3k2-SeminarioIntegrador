package com.harp.backend.entities.perfil.repository;

import com.harp.backend.entities.perfil.model.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPerfilRepository extends JpaRepository<Perfil, Long> {
}
