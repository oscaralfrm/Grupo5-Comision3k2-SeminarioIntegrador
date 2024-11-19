package com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.modalidad.Modalidad;
import com.harp.backend.entities.servicio.Servicio;

import java.util.List;

public interface IEstrategiaInscripcion {
    // el pase libre ignorará el numGrupo y horarios y lo hará en el grupo unico
    Inscripcion crearInscripcion(Servicio servicio, Long idGrupo, List<Long> idsHorarios, Alumno alumno);
    boolean tieneCuposLibres(Servicio servicio, Long idGrupo, List<Long> idsHorarios);
    boolean tieneEstasVecesSemanales(Servicio servicio, int cantVecesSemanales);
    Integer obtenerCuposLibres (Servicio servicio, Long idGrupo, List<Long> idsHorarios);
}
