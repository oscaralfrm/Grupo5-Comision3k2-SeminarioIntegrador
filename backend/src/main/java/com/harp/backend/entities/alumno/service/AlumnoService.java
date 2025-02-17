package com.harp.backend.entities.alumno.service;

import com.harp.backend.entities.alumno.dto.AlumnoDTO;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.repository.IAlumnoRepository;
import com.harp.backend.entities.asistencia.Asistencia;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.instructor.InstructorDTO;
import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.perfil.service.IPerfilService;
import com.harp.backend.entities.servicio.IServicioService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.service.IUsuarioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.*;
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

        Usuario usuario = usuarioService.createUsuarioDeAlumno(alumnoDTO);
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
                .orElseThrow(() -> new NoSuchElementFoundException("Alumno no encontrado"));
    }

    @Override
    public Alumno findAlumnoByNombreUsuario(String nombreUsuario) {
        return alumnoRepository.findByUsuarioNombreUsuario(nombreUsuario);
    }

    public List<Alumno> getAlumnosInscriptosAServicio() {
        return getAllAlumnos().stream().filter(Alumno::estaInscriptoAServicio).toList();
    }

    public List<Inscripcion> findInscripcionesDeAlumno(Long idAlumno) {
        Alumno alumnoExistente = this.findAlumno(idAlumno);
        return alumnoExistente.getInscripciones().stream()
                .sorted(Comparator.comparing(Inscripcion::getFechaSolicitud).reversed()) // Ordena por fechaSolicitud
                .collect(Collectors.toList());
    }

    public List<Inscripcion> findInscripcionesVigentesDeAlumno(Long idAlumno) {
        return this.findInscripcionesDeAlumno(idAlumno).stream()
                .filter(Inscripcion::estaVigente)
                .sorted(Comparator.comparing(Inscripcion::getFechaSolicitud).reversed()) // Ordena por fechaSolicitud
                .collect(Collectors.toList());
    }

    public List<Inscripcion> findInscripcionesPendientesDeAlumno(Long idAlumno) {
        return this.findInscripcionesDeAlumno(idAlumno).stream()
                .filter(Inscripcion::estaPendiente)
                .sorted(Comparator.comparing(Inscripcion::getFechaSolicitud).reversed()) // Ordena por fechaSolicitud
                .collect(Collectors.toList());
    }

    @Override
    public Alumno editAlumno(Long idAlumno, AlumnoDTO alumnoDTO) {
        Alumno alumnoExistente = this.findAlumno(idAlumno);
        //instructorExistente = instructorConverter.dtoToEntity(instructorDTO);
        //instructorExistente.setId(idInstructor);

        alumnoExistente.getUsuario().setNombre(alumnoDTO.getNombre());
        alumnoExistente.getUsuario().setApellido(alumnoDTO.getApellido());
        //instructorExistente.getUsuario().setEmail(instructorDTO.getEmail());
        alumnoExistente.getUsuario().setTelefono(alumnoDTO.getTelefono());
        alumnoExistente.getUsuario().setDireccion(alumnoDTO.getDireccion());
        alumnoExistente.getUsuario().setContrasena(alumnoDTO.getContrasena());
        alumnoExistente.getUsuario().setFechaNacimiento(alumnoDTO.getFechaNacimiento());
        alumnoExistente.getUsuario().setFotoPerfilURL(alumnoDTO.getFotoPerfilURL());

        return alumnoRepository.save(alumnoExistente);
    }

    public void editarFotoPerfil(Long idAlumno, String fotoPerfilURL) {
        Alumno alumno = this.findAlumno(idAlumno);
        alumno.getUsuario().setFotoPerfilURL(fotoPerfilURL);
        alumnoRepository.save(alumno);
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

    public Map<Long, List<Clase>>  obtenerClasesDeAlumno(Long idAlumno, boolean proximas, boolean anteriores) {
        Alumno alumno = this.findAlumno(idAlumno);
        List<Inscripcion> inscripciones = alumno.obtenerInscripcionesVigentes();

        Map<Long, List<Clase>> clasesPorGrupo = new HashMap<>();
        for (Inscripcion inscripcion : inscripciones) {
            if (proximas && ! anteriores) {
                clasesPorGrupo.put(inscripcion.getGrupo().getId(), inscripcion.getGrupo().getClasesFuturas());
            } else if (anteriores && !proximas) {
                clasesPorGrupo.put(inscripcion.getGrupo().getId(), inscripcion.getGrupo().getClasesAnteriores());
            } else {
                clasesPorGrupo.put(inscripcion.getGrupo().getId(), inscripcion.getGrupo().getClases().stream().toList());
            }
        }

        return clasesPorGrupo;
    }

    public void agregarServicioFavoritoAAlumno(Long idAlumno, Long idServicio) {
        Servicio servicio = servicioService.findServicio(idServicio);
        Alumno alumno = this.findAlumno(idAlumno);
        if (! servicio.esPublicado()) {
            throw new UnsupportedOperationException("El servicio no está publicado por lo que no se puede agregar a favoritos.");
        }
        alumno.agregarServicioAFavoritos(servicio);
        alumnoRepository.save(alumno);
    }

    public void quitarServicioFavoritoDeAlumno(Long idAlumno, Long idServicio) {
        Servicio servicio = servicioService.findServicio(idServicio);
        Alumno alumno = this.findAlumno(idAlumno);
        alumno.quitarServicioDeFavoritos(servicio);
        alumnoRepository.save(alumno);
    }

    public List<Servicio> getServiciosFavoritosDeAlumno(Long idAlumno) {
        Alumno alumno = this.findAlumno(idAlumno);
        return alumno.getServiciosFavoritos();
    }
}
