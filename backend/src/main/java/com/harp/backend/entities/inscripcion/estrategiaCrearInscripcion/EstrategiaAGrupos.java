package com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.util.List;

public class EstrategiaAGrupos implements IEstrategiaInscripcion{
    @Override
    public Inscripcion crearInscripcion(Servicio servicio, Long idGrupo, List<Long> idsHorarios, Alumno alumno) {
        Grupo grupo = servicio.obtenerGrupoConEsteId(idGrupo);
        //List<Horario> horarios = grupo.obtenerHorariosConEstosIds(idsHorarios);

        // Aca se podria crear la inscripcion definiendo la cantVecesSemanales por la cantidad de horarios
        Inscripcion nuevaInscripcion = new Inscripcion(servicio, grupo, alumno);
        return nuevaInscripcion;
    }

    @Override
    public boolean tieneCuposLibres(Servicio servicio, Long idGrupo, List<Long> idsHorarios) {
        Grupo grupo = servicio.obtenerGrupoConEsteId(idGrupo);
        // Si la cant max alumnos es null quiere decir que tiene ilimitados cupos
        if (grupo.getCantMaxAlumnos() == null) {
            return true;
        }
        // calculamos la cantidad de inscripciones que hay en ese grupo
        Integer cantAlumnosGrupo = servicio.obtenerInscripcionesVigentes(grupo).size();

        return (grupo.getCantMaxAlumnos() > cantAlumnosGrupo);
    }

    @Override
    public Integer obtenerCuposLibres (Servicio servicio, Long idGrupo, List<Long> idsHorarios) {
        Grupo grupo = servicio.obtenerGrupoConEsteId(idGrupo);
        // calculamos la cantidad de inscripciones que hay en ese grupo
        Integer cantAlumnosGrupo = servicio.obtenerInscripcionesVigentes(grupo).size();
        return (grupo.getCantMaxAlumnos() - cantAlumnosGrupo);
    }

//    public List<MontoServicio> obtenerMontoActual() {
// IMPLEMENTAR
//    }

    // CAMbiar a tieneMontoActual(cantVecesSemanales)
    // En AGrupo no fijamos en cada grupo a ver si alguno cumple con esa cant
    @Override
    public boolean tieneEstasVecesSemanales(Servicio servicio, int cantVecesSemanales) {
        // RECORRER LOS GRUPOS Y VER SI ALGUNO CUMPLE CON ESAS VECES SEMANALES
       return servicio.getGrupos().stream()
                .anyMatch(grupo -> grupo.tieneEstasVecesSemanales(cantVecesSemanales));
    }
}
