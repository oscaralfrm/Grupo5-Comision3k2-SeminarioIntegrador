package com.harp.backend.entities.grupo;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.horario.Horario;
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

    @Override
    public Grupo editGrupo(Long idGrupo, GrupoDTO grupoDTO) {
        Grupo grupoExistente = this.findGrupo(idGrupo);
        grupoExistente = grupoConverter.dtoToEntity(grupoDTO);
        grupoExistente.setId(idGrupo);
        return grupoRepository.save(grupoExistente);
    };

    public void agregarAlumnoAGrupo(Alumno alumno, Long idGrupo) {
        Grupo grupoExistente = findGrupo(idGrupo);
        grupoExistente.agregarAlumno(alumno);
        grupoRepository.save(grupoExistente);
        //Lo usamos al crear la Entidad inscripción
    }

    public void agregarHorarioAGrupo(Horario horario, Long idGrupo) {
        Grupo grupoExistente = findGrupo(idGrupo);
        grupoExistente.agregarHorario(horario);
        grupoRepository.save(grupoExistente);
    }
}
