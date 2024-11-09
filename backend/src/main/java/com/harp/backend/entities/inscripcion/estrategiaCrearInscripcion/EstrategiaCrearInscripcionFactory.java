package com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion;

import com.harp.backend.entities.modalidad.Modalidad;

public class EstrategiaCrearInscripcionFactory {
    public static IEstrategiaInscripcion getEstrategia(Modalidad modalidad) {
        switch (modalidad) {
            case Modalidad.AGrupo:
                return new EstrategiaAGrupos();
            case Modalidad.AServicio:
                return new EstrategiaAServicio();
//            case Modalidad.AHorarios:
//                return new EstrategiaAHorarios();
            default:
                throw new UnsupportedOperationException("Modalidad no valida");
        }
    }
}
