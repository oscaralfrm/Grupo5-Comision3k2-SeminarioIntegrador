package com.harp.backend.entities.clase;

import com.harp.backend.entities.horario.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IClaseRepository extends JpaRepository<Clase, Long> {
    List<Clase> findByHorario(Horario horario);
    @Query(value = "SELECT c.*  FROM clases c JOIN horarios h ON c.horario_id = h.id WHERE h.grupo_id = :idGrupo", nativeQuery = true)
    List<Clase> findClasesDeGrupo(@Param("idGrupo") Long idGrupo);
}
