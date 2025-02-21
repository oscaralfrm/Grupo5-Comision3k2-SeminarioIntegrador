package com.harp.backend.entities.horario;


import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.asistencia.AsistenciaService;
import com.harp.backend.entities.clase.ClaseService;
import com.harp.backend.entities.clase.IClaseService;
import com.harp.backend.entities.diaSemana.DiaSemana;
import com.harp.backend.entities.diaSemana.DiaSemanaService;
import com.harp.backend.entities.grupo.GrupoService;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HorarioService implements IHorarioService {

    @Autowired
    private IHorarioRepository horarioRepository;

    @Autowired
    private DiaSemanaService diaSemanaService;

    @Autowired
    private HorarioConverter horarioConverter;

//    @Autowired
//    private GrupoService grupoService;

    @Autowired
    private ClaseService claseService;

    @Override
    public List<Horario> getAllHorarios() {
        return horarioRepository.findAll();
    };

    // Ya no hacemos que desde aca se agrega al grupo, ahora se hace en GrupoService
//    @Override
//    public Horario createHorario(HorarioDTO horarioDTO, Long idGrupo) {
//        Horario nuevoHorario = horarioConverter.dtoToEntity(horarioDTO);
//        Horario horarioCreado = horarioRepository.save(nuevoHorario);
//        grupoService.agregarHorarioAGrupo(horarioCreado, idGrupo);
//        return horarioCreado;
//    };

    @Override
    public Horario createHorario(HorarioDTO horarioDTO) {
        Horario nuevoHorario = horarioConverter.dtoToEntity(horarioDTO);
        Horario horarioCreado = horarioRepository.save(nuevoHorario);

        return horarioCreado;
    };


    public Horario saveHorario(Horario horario) {
        horarioRepository.save(horario);
        return horario;
    };

    @Override
    public void deleteHorario(Long idHorario){
        //Se valida que exista
        this.findHorario(idHorario);
        horarioRepository.deleteById(idHorario);
    };

    @Override
    public Horario findHorario(Long idHorario){
        return horarioRepository.findById(idHorario)
                .orElseThrow(() -> new NoSuchElementFoundException("Horario no encontrado"));
    };

    @Override
    public Horario editHorario(Long idHorario, HorarioDTO horarioDTO) {
        Horario horarioEditado = this.findHorario(idHorario);
        horarioEditado = horarioConverter.dtoToEntity(horarioDTO);
        horarioEditado.setId(idHorario);
        return horarioRepository.save(horarioEditado);
    };


    // FALTA IMPLEMENTAR EL CAMBIO DE GRUPO o de HORARIO

    public void agregarAlumnoAAsistencias(Inscripcion inscripcionExistente, Horario horario) {
        claseService.agregarAsistenciasDeAlumnoNuevoAClasesFuturas(inscripcionExistente, horario);
    }

//    public void agregarAlumnoAHorario(Alumno alumnoExistente, Horario horario) {
//        // Agregamos al alumno al horario y persistimos los cambios
//        horario.agregarAlumno(alumnoExistente);
//        horarioRepository.save(horario);
//        //Agregar asistencias alumno a las clases futuras ya creadas
//        claseService.agregarAsistenciasDeAlumnoNuevoAClasesFuturas(alumnoExistente, horario);
//    }
//
//    public void eliminarAlumnoDeUnHorario(Alumno alumnoExistente, Horario horario) {
//        // Eliminamos el alumno del horario y persistimos los cambios
//        horario.eliminarAlumno(alumnoExistente);
//        horarioRepository.save(horario);
//
//        // Eliminar asistencias alumno de clases futuras ya creadas
//        claseService.eliminarAsistenciasDeAlumnoDeClasesFuturas(alumnoExistente, horario);
//    }
//
//    public void eliminarAlumnoDeHorarios(Alumno alumnoExistente, List<Horario> horarios) {
//        for (Horario horario : horarios) {
//            eliminarAlumnoDeUnHorario(alumnoExistente, horario);
//        }
//    }

}
