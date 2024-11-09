package com.harp.backend.entities.inscripcion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.HorarioDTO;
import com.harp.backend.entities.servicio.Servicio;

import java.time.LocalDate;
import java.util.List;

public interface IInscripcionService {
    public List<Inscripcion> getAllInscripciones();
    //public List<Inscripcion> findInscripcionesDeServicio(Long idServicio);
    public Inscripcion createInscripcion(Long idAlumno, Long idServicio, Long idGrupo, List<Long> idsHorarios);
    public void deleteInscripcion(Long idInscripcion);
    public Inscripcion findInscripcion(Long idInscripcion);
    //public Inscripcion editInscripcion(Long idInscripcion, InscripcionDTO inscripcionDTO);
    public void aceptarInscripcion(Long idInstructor, Long idServicio, Long idInscripcion, LocalDate fechaInicioActividad);
    public void agregarCuotaAInscripcion(Inscripcion inscripcion, Cuota cuotaCreada);
    public void rechazarInscripcion(Long idInscripcion);
    public void finalizarInscripcion(Long idInscripcion);
    //List<Inscripcion> findInscripcionesDeServicio(Long idServicio);
}
