package com.harp.backend.entities.inscripcion;

import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.HorarioDTO;

import java.util.List;

public interface IInscripcionService {
    public List<Inscripcion> getAllInscripciones();
    //public List<Inscripcion> findInscripcionesDeServicio(Long idServicio);
    public Inscripcion createInscripcion(Long idAlumno, Long idServicio, String codigoIngresado);
    public void deleteInscripcion(Long idInscripcion);
    public Inscripcion findInscripcion(Long idInscripcion);
    public Inscripcion editInscripcion(Long idInscripcion, InscripcionDTO inscripcionDTO);
    public void aceptarInscripcion(Long idInscripcion);
    public void rechazarInscripcion(Long idInscripcion);
    public void finalizarInscripcion(Long idInscripcion);
    List<Inscripcion> findInscripcionesDeServicio(Long idServicio);
}
