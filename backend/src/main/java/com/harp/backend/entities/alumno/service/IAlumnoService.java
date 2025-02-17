package com.harp.backend.entities.alumno.service;

import com.harp.backend.entities.alumno.dto.AlumnoDTO;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.asistencia.Asistencia;
import com.harp.backend.entities.asistencia.AsistenciaController;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IAlumnoService {

    List<Alumno> getAllAlumnos();
    Alumno createAlumno(AlumnoDTO alumnoDTO);
    void deleteAlumno(Long idAlumno);
    Alumno findAlumno(Long idAlumno);
    Alumno findAlumnoByNombreUsuario(String nombreUsuario);
    Alumno editAlumno(Long idAlumno, AlumnoDTO alumnoDTO);
    List<Inscripcion> findInscripcionesDeAlumno(Long idAlumno);
    public List<Inscripcion> findInscripcionesVigentesDeAlumno(Long idAlumno);
    List<Inscripcion> findInscripcionesPendientesDeAlumno(Long idAlumno);
    List<Cuota> obtenerHistorialCuotasEsteAlumnoYServicio(Long idAlumno, Long idServicio);
    Map<Long, List<Clase>> obtenerClasesDeAlumno(Long idAlumno, boolean proximas, boolean anteriores);
    void editarFotoPerfil(Long idAlumno, String fotoPerfilURL);

    public void quitarServicioFavoritoDeAlumno(Long idAlumno, Long idServicio);
    public void agregarServicioFavoritoAAlumno(Long idAlumno, Long idServicio);
    List<Servicio> getServiciosFavoritosDeAlumno(Long idAlumno);
}
