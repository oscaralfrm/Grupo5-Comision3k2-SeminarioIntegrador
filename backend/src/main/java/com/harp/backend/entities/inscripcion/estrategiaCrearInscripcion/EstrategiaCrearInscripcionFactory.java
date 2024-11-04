package com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion;

import com.harp.backend.entities.modalidad.Modalidad;

public class EstrategiaCrearInscripcionFactory {
    public static IEstrategiaInscripcion getEstrategia(Modalidad modalidad) {
        switch (modalidad) {
            case Modalidad.GruposConHorariosFijos:
                return new EstrategiaGruposConHorariosFijos();
            case Modalidad.PaseLibre:
                return new EstrategiaPaseLibre();
            case Modalidad.EleccionHorarioCadaXTiempo:
                return new EstrategiaHorarioCadaXTiempo();
            default:
                throw new UnsupportedOperationException("Modalidad no valida");
        }
    }
}
