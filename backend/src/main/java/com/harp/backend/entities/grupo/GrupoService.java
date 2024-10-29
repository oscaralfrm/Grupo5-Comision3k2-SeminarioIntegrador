package com.harp.backend.entities.grupo;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.AlumnoService;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrupoService implements IGrupoService {

    @Autowired
    // Hacemos inyección de dependencia del repositorio...
    private IGrupoRepository grupoRepository;

    @Autowired
    private GrupoConverter grupoConverter;

    @Autowired
    private ServicioService servicioService;

    @Autowired
    private AlumnoService alumnoService;

    @Override
    public List<Grupo> getAllGrupos() {
        return grupoRepository.findAll();
    };

    /*
    public List<Grupo> getGruposDeServicio(Long idServicio) {
    }

    public List<Grupo> getGruposDeIntructorDeHoy(Long idInstructor) {
    }
     */

    @Override
    public Grupo createGrupo(GrupoDTO grupoDTO, Long idServicio) {
        Grupo nuevoGrupo = grupoConverter.dtoToEntity(grupoDTO);
        Grupo grupoCreado = grupoRepository.save(nuevoGrupo);
        servicioService.agregarGrupoAServicio(nuevoGrupo, idServicio);
        return grupoCreado;
    };

    @Override
    public void deleteGrupo(Long idGrupo){
        this.findGrupo(idGrupo);
        grupoRepository.deleteById(idGrupo);
    };

    @Override
    public Grupo findGrupo(Long idGrupo){
        return grupoRepository.findById(idGrupo)
                .orElseThrow(() -> new NoSuchElementFoundException("Grupo no encontrado"));
    };

    public List<Horario> findHorariosDeGrupo(Long idGrupo) {
        Grupo grupoExistente = this.findGrupo(idGrupo);
        return grupoExistente.getHorarios().stream().toList();
    }

    public List<Grupo> findGruposDeAlumno(Long idAlumno) {
        // Revisar como hacer validaciones aqui
        // Validar que el alumno exista, que este en algun grupo?
        return grupoRepository.findByAlumnosId(idAlumno);
    }


    @Override
    public Grupo editGrupo(Long idGrupo, GrupoDTO grupoDTO) {
        Grupo grupoExistente = this.findGrupo(idGrupo);
        grupoExistente = grupoConverter.dtoToEntity(grupoDTO);
        grupoExistente.setId(idGrupo);
        return grupoRepository.save(grupoExistente);
    };

//    @Override
//    public void agregarAlumnoAGrupo(Alumno alumno, Long idGrupo) {
//        Grupo grupoExistente = this.findGrupo(idGrupo);
//        grupoExistente.agregarAlumno(alumno);
//        grupoRepository.save(grupoExistente);
//        //Lo usamos al crear la Entidad inscripción?
//    }
//
//    @Override
//    public void eliminarAlumnoDeGrupo(Alumno alumno, Long idGrupo) {
//        Grupo grupoExistente = this.findGrupo(idGrupo);
//        grupoExistente.eliminarAlumno(alumno);
//        grupoRepository.save(grupoExistente);
//    }

    public void agregarHorarioAGrupo(Horario horario, Long idGrupo) {
        Grupo grupoExistente = findGrupo(idGrupo);
        grupoExistente.agregarHorario(horario);
        grupoRepository.save(grupoExistente);
    }


    public void agregarAlumnoAGrupo(Long idServicio, Integer numGrupo, Long idAlumno) {
        // Tengo que saber de que servicio es este grupo
        Servicio servicio = servicioService.findServicio(idServicio);

        // Buscamos el alumno y el grupo
        Alumno alumnoExistente = alumnoService.findAlumno(idAlumno);
        //Implementar
        Grupo grupoExistente = servicioService.findGrupoDeServicioByNum(idServicio, numGrupo);

        // Validar que el alumno este inscripto ACTUALMENTE en el servicio de ese grupo
        if (! alumnoExistente.estaInscriptoAEsteServicio(servicio)) {
            throw new UnsupportedOperationException("El alumno no está inscripto en este servicio.");
        }

        // Validar que el alumno no esté previamente en ese grupo? Se resuelve con set?
        grupoExistente.agregarAlumno(alumnoExistente);
        grupoRepository.save(grupoExistente);
    }

    public void eliminarAlumnoDeGrupo(Long idServicio, Integer numGrupo, Long idAlumno) {
        // Tengo que saber de que servicio es este grupo
        Servicio servicio = servicioService.findServicio(idServicio);

        // Buscamos el alumno y el grupo
        Alumno alumnoExistente = alumnoService.findAlumno(idAlumno);
        //Implementar
        Grupo grupoExistente = servicioService.findGrupoDeServicioByNum(idServicio, numGrupo);

        // Validar que el alumno este inscripto ACTUALMENTE en el servicio de ese grupo
        if (! alumnoExistente.estaInscriptoAEsteServicio(servicio)) {
            throw new UnsupportedOperationException("El alumno no está inscripto en este servicio.");
        }

        //Buscamos los alumnos del grupo
        if (!grupoExistente.tieneAEsteAlumno(alumnoExistente)) {
            throw new UnsupportedOperationException("El alumno no está actualmente en este grupo.");
        }

        grupoExistente.eliminarAlumno(alumnoExistente);
        grupoRepository.save(grupoExistente);
    }
}
