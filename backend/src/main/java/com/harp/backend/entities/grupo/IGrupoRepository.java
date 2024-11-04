package com.harp.backend.entities.grupo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface IGrupoRepository extends JpaRepository<Grupo, Long> {
    //public List<Grupo> findByAlumnosId(Long idAlumno);
}
