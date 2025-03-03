package com.harp.backend.entities.instructor;

import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.instructor.estadisticas.*;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.estadisticas.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Month;
import java.time.Year;
import java.util.List;

public interface IInstructorService {

    List<Instructor> getAllInstructores();
    void deleteInstructor(Long idInstructor);
    Instructor findInstructor(Long idInstructor);
    Instructor findInstructorByNombreUsuario(String nombreUsuario);
    Instructor editInstructor(Long idInstructor, InstructorDTO instructorDTO);
    Instructor createInstructor(InstructorDTO instructorDTO);
    List<Servicio> findServiciosDeInstructor(Long idInstructor);
    public List<Servicio> findServiciosPublicadosDeInstructor(Long idInstructor);
    List<Servicio> findServiciosVigentesDeInstructor(Long idInstructor);
    List<Servicio> findServiciosActivosDeInstructor(Long idInstructor);
    double[] calcularIngresosPorMesDeServiciosDeInstructor(Long idInstructor, Year year);
    Long validarInicioSesion(String email, String contrasena);
    void completarDatosBancariosDeInstructor(Long idInstructor, DatosBancarios datosBancarios);
    boolean tieneDatosBancariosCompletos(Long idInstructor);
    void editarFotoPerfil(Long idInstructor, String fotoPerfilURL);
    String agregarCvInstructor(Long idInstructor, String cvURL);
    boolean esteInstructorTieneServicioConEsteNombre(Long idInstructor, String nombre);
    List<Inscripcion> findUltimasInscripcionesNoPendientesDeServiciosDeInstructor(Long idInstructor, int cant);
    List<Inscripcion> findSolicitudesInscripcionPendientes(Long idInstructor);
    EstadisticasAsistenciasInstructorDTO obtenerEstadisticasAsistenciasInstructor(Long idInstructor, Month month, Year year);
    EstadisticasPagosInstructorDTO obtenerEstadisticasPagosInstructor(Long idInstructor, Month month, Year year);
    EstadisticasPreciosInstructorDTO obtenerEstadisticasPreciosInstructor(Long idInstructor, Month month, Year year);
    EstadisticasInscripcionesInstructorDTO obtenerEstadisticasInscripcionesInstructor(Long idInstructor, Month month, Year year);
    EstadisticasIngresosInstructorDTO obtenerEstadisticasIngresosInstructor(Long idInstructor, Month month, Year year);
}
