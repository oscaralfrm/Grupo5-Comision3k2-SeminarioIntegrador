/*
package com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion;

import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.util.List;

public class EstrategiaAHorarios implements IEstrategiaInscripcion {
    @Override
    public Inscripcion crearInscripcion(Servicio servicio, Long idGrupo, List<Long> idsHorarios) {
        Grupo grupo = servicio.obtenerGrupoConEsteId(idGrupo);
        List<Horario> horarios = grupo.obtenerHorariosConEstosIds(idsHorarios);

        // Aca se podria crear la inscripcion definiendo la cantVecesSemanales por la cantidad de horarios
        Inscripcion nuevaInscripcion = new Inscripcion(grupo, horarios);
        return nuevaInscripcion;
    }

    @Override
    public boolean tieneEstasVecesSemanales(Servicio servicio, int cantVecesSemanales) {
        // VER COMO HACER
    }
}

*/