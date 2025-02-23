package com.harp.backend.entities.instructor;

import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;
import org.springframework.web.multipart.MultipartFile;

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
    double[] calcularIngresosPorMesDeServiciosDeInstructor(Long idInstructor);
    Long validarInicioSesion(String email, String contrasena);
    void completarDatosBancariosDeInstructor(Long idInstructor, DatosBancarios datosBancarios);
    boolean tieneDatosBancariosCompletos(Long idInstructor);
    void editarFotoPerfil(Long idInstructor, String fotoPerfilURL);
    String agregarCvInstructor(Long idInstructor, String cvURL);
    boolean esteInstructorTieneServicioConEsteNombre(Long idInstructor, String nombre);
    List<Inscripcion> findUltimasInscripcionesNoPendientesDeServiciosDeInstructor(Long idInstructor, int cant);
    List<Inscripcion> findSolicitudesInscripcionPendientes(Long idInstructor);
}
