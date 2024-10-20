package com.harp.backend.entities.permiso.repository;

import com.harp.backend.entities.permiso.model.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPermisoRepository extends JpaRepository<Permiso, Long> {
}
