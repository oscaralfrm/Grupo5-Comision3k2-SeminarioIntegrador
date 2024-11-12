package com.harp.backend.entities.alumno.service;

import com.harp.backend.entities.alumno.dto.AlumnoDTO;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.repository.IAlumnoRepository;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.perfil.service.IPerfilService;
import com.harp.backend.entities.servicio.IServicioService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.service.IUsuarioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AlumnoService implements IAlumnoService {

    @Autowired
    private IAlumnoRepository alumnoRepository;

    @Autowired
    private IServicioService servicioService;

    @Autowired
    private IUsuarioService usuarioService;

    @Autowired
    private IPerfilService perfilService;

    @Override
    public List<Alumno> getAllAlumnos() {
        return alumnoRepository.findAll();
    }

    @Override
    public Alumno createAlumno(AlumnoDTO alumnoDTO) {
        Alumno nuevoAlumno = new Alumno();

        // Usuario
        Usuario usuario = new Usuario(alumnoDTO);

        //Perfil al usuario
        Perfil perfil = perfilService.findPerfil(2L);
        usuario.setPerfiles(Set.of(perfil));

        usuarioService.saveUsuario(usuario);
        nuevoAlumno.setUsuario(usuario);

        return alumnoRepository.save(nuevoAlumno);
    }

    @Override
    public void deleteAlumno(Long idAlumno) {
        alumnoRepository.deleteById(idAlumno);
    }

    @Override
    public Alumno findAlumno(Long idAlumno) {
        return alumnoRepository.findById(idAlumno)
                .orElseThrow(() -> new NoSuchElementFoundException("Servicio no encontrado"));
    }

    public List<Alumno> getAlumnosInscriptosAServicio() {
        return getAllAlumnos().stream().filter(Alumno::estaInscriptoAServicio).toList();
    }

    public List<Inscripcion> findInscripcionesDeAlumno(Long idAlumno) {
        Alumno alumnoExistente = this.findAlumno(idAlumno);
        return alumnoExistente.getInscripciones().stream().toList();
    }

    @Override
    public Alumno editAlumno(Alumno alumno) {
        return alumnoRepository.save(alumno);
    }

    public void agregarInscripcionAAlumno(Inscripcion inscripcion, Alumno alumnoExistente) {
        alumnoExistente.agregarInscripcion(inscripcion);
        alumnoRepository.save(alumnoExistente);
    }

    public Alumno findAlumnoConEstaInscripcion(Inscripcion inscripcion) {
        Alumno alumnoExistente = alumnoRepository.findAlumnoByInscripciones(inscripcion);
        return alumnoExistente;
    }

//    public void agregarCuotaAAlumno(Alumno alumno, Cuota cuota) {
//        alumno.agregarCuota(cuota);
//    }

    // se podría hacer en servicioService tmb
    public List<Cuota> obtenerHistorialCuotasEsteAlumnoYServicio(Long idAlumno, Long idServicio) {
        Servicio servicio = servicioService.findServicio(idServicio);
        Alumno alumno = this.findAlumno(idAlumno);
        return alumno.obtenerHistorialCuotasEsteServicio(servicio);
    }

}
