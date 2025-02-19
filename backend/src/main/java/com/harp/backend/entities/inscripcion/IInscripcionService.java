package com.harp.backend.entities.inscripcion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.HorarioDTO;
import com.harp.backend.entities.resenia.Resenia;
import com.harp.backend.entities.servicio.Servicio;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface IInscripcionService {
    public List<Inscripcion> getAllInscripciones();
    //public List<Inscripcion> findInscripcionesDeServicio(Long idServicio);
    public Inscripcion createInscripcion(Long idAlumno, Long idServicio, Long idGrupo, List<Long> idsHorarios);
    public void deleteInscripcion(Long idInscripcion);
    public Inscripcion findInscripcion(Long idInscripcion);
    //public Inscripcion editInscripcion(Long idInscripcion, InscripcionDTO inscripcionDTO);
    public void aceptarInscripcion(Long idServicio, Long idInscripcion, LocalDate fechaInicioActividad);
    public void agregarCuotaAInscripcion(Inscripcion inscripcion, Cuota cuotaCreada);
    public void rechazarInscripcion(Long idInscripcion, String motivo);
    public void finalizarInscripcion(Long idInscripcion);
    //List<Inscripcion> findInscripcionesDeServicio(Long idServicio);
    public List<Cuota> obtenerHistorialCuotasInscripcion(Long idInscripcion);
    public List<Cuota> obtenerUltimaCuotaOVencidasYPendientes(Long idInscripcion);
    public List<Cuota> obtenerCuotasPendientesOVencidasDeInscripcion(Long idInscripcion);
    public ResumenPagosDTO obtenerResumenPagosDeInscripcion(Long idInscripcion);
}
