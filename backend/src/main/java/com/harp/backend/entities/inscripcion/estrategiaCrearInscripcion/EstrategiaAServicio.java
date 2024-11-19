package com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.util.List;

public class EstrategiaAServicio implements IEstrategiaInscripcion{
    @Override
    public Inscripcion crearInscripcion(Servicio servicio, Long idGrupo, List<Long> idsHorarios, Alumno alumno) {
        // Aca se podria crear la inscripcion definiendo la cantVecesSemanales
        Inscripcion nuevaInscripcion = new Inscripcion(servicio, alumno);
        nuevaInscripcion.setCantVecesSemanales(servicio.getCantVecesSemanales());
        return nuevaInscripcion;
    }

    @Override
    public boolean tieneCuposLibres(Servicio servicio, Long idGrupo, List<Long> idsHorarios) {
        Integer cantAlumnosTotales = servicio.obtenerInscripcionesVigentes().size();
        return (servicio.getCantMaxAlumnos() > cantAlumnosTotales);
    }

    @Override
    public Integer obtenerCuposLibres(Servicio servicio, Long idGrupo, List<Long> idsHorarios) {
        Integer cantAlumnosTotales = servicio.obtenerInscripcionesVigentes().size();
        return (servicio.getCantMaxAlumnos() - cantAlumnosTotales);
    }

    // PODEMOS CAMBIAR ESTE METODO POR UN tieneMontoActual(cantVecesSemanales)
    // y en el caso del AServicio ignoramos el cantVecesSemanales
    @Override
    public boolean tieneEstasVecesSemanales(Servicio servicio, int cantVecesSemanales) {
//        return (servicio.getCantVecesSemanales().equals(cantVecesSemanales));
        return true;
    }

}
