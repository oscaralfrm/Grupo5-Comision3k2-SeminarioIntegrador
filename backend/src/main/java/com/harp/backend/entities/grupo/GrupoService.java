package com.harp.backend.entities.grupo;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.AlumnoService;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.clase.IClaseService;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.HorarioConverter;
import com.harp.backend.entities.horario.HorarioDTO;
import com.harp.backend.entities.horario.IHorarioService;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.IServicioService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.LongAccumulator;

@Service
public class GrupoService implements IGrupoService {

    @Autowired
    // Hacemos inyección de dependencia del repositorio...
    private IGrupoRepository grupoRepository;

    @Autowired
    private GrupoConverter grupoConverter;

    @Autowired
    private IServicioService servicioService;

    @Autowired
    private AlumnoService alumnoService;

    @Autowired
    private IHorarioService horarioService;

    @Autowired
    private IClaseService claseService;

    @Autowired
    private HorarioConverter horarioConverter;

    //Lo usamos en la generacion de clases automaticas
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
        //Aca se deberia busar el ultimo numero y sumarle 1
        Grupo nuevoGrupo = grupoConverter.dtoToEntity(grupoDTO);
        Grupo grupoCreado = grupoRepository.save(nuevoGrupo);
        Servicio servicio = servicioService.findServicio(idServicio);
        servicioService.agregarGrupoAServicio(nuevoGrupo, servicio);
        return grupoCreado;
    };

    @Transactional
    @Override
    public Grupo createGrupoConHorarios(GrupoDTO grupoDTO, Long idServicio) {
        //Grupo grupoCreado = this.createGrupo(grupoDTO, idServicio);
        Grupo nuevoGrupo = grupoConverter.dtoToEntity(grupoDTO);
        Grupo grupoCreado = grupoRepository.save(nuevoGrupo);
        Servicio servicio = servicioService.findServicio(idServicio);
        servicioService.agregarGrupoAServicio(nuevoGrupo, servicio);

        List<HorarioDTO> horariosDTO = grupoDTO.getHorarios();
        // Validar aca que no se superpongan los horarios de ls grupos

        for (HorarioDTO horarioDTO : horariosDTO) {
            boolean noCumple = servicio.tienGrupoEnEsteHorario(horarioDTO.getHoraInicio(),
                    horarioDTO.getHoraFin(),
                    horarioDTO.getNombreDiaSemana());
            if (noCumple) {
                throw new UnsupportedOperationException("Un horario se superpone con otro configurado previamente.");
            }
        }

        List<Horario> horarios = horariosDTO.stream().map(dto -> horarioConverter.dtoToEntity(dto)).toList();

        for (int i=0; i< horarios.size(); i++) {
            Horario horario1 = horarios.get(i);

            for (int j = i+1; j<horariosDTO.size(); j++) {
                Horario horario2 = horarios.get(j);
                if (horario2.estaEn(horario1.getHoraInicio(),
                        horario1.getHoraFin(),
                        horario1.getDiaSemana().getNombre())) {
                    throw new UnsupportedOperationException("Los horarios ingresados se superponen entre sí");
                }
            }
        }

        // Por cada horario que nos llega
        for (Horario horario : horarios) {
            // aca asignarle al grupo el numero del último asociado al servicio
            horarioService.saveHorario(horario);
            grupoCreado.agregarHorario(horario);
        }

        System.out.println("horarios" + horarios);

        grupoRepository.save(grupoCreado);

        // aca nos fijamos si el servicio tiene asistencias activas en caso de tenerlas
        // llamamos a claseService y le generamos las asistencias
        // seria mejor que todos estos servicios los llamaramos desde servicioService
        // y que aca solo nos llegue el servicio
        if (servicio.isAsistenciasActivas() && servicio.tieneFechaInicio()) {
            // Creamos las clases a partir de la fecha inicio del servicio
            // Cuando setteamos la fecha inicio tambien deberiamos crear las clases
            claseService.crearClasesParaSemanaSiguienteGrupo(grupoCreado, servicio.getFechaInicio());
        }

        return grupoCreado;
    }


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

    public List<Clase> findAllClasesDeGrupo(Long idGrupo) {
        Grupo grupoExistente = this.findGrupo(idGrupo);
        return grupoExistente.getClases().stream().toList();
    }

    public List<Clase> findClasesFuturasDeGrupo(Long idGrupo) {
        Grupo grupoExistente = this.findGrupo(idGrupo);
        return grupoExistente.getClases().stream().filter(Clase::esFutura).toList();
    }

    public List<Inscripcion> findInscripcionesDeGrupo(Long idServicio, Long idGrupo,
                                                      boolean vigentes, boolean pendientes) {
        Servicio servicio = servicioService.findServicio(idServicio);
        Grupo grupo = this.findGrupo(idGrupo);
        if (vigentes) {
            return servicio.obtenerInscripcionesVigentes(grupo);
        } else {
            if (pendientes) {
                return servicio.obtenerInscripcionesPendientes(grupo);
            }
        }
        return servicio.obtenerInscripciones(grupo);
    }

    public List<Alumno> obtenerAlumnosActualesDeGrupo(Long idServicio, Long idGrupo) {
        Grupo grupo = this.findGrupo(idGrupo);
        Servicio servicio = servicioService.findServicio(idServicio);
        return servicio.obtenerAlumnosActualesDeGrupo(grupo);
    }

//    public List<Grupo> findGruposDeAlumno(Long idAlumno) {
//        // Revisar como hacer validaciones aqui
//        // Validar que el alumno exista, que este en algun grupo?
//        return grupoRepository.findByAlumnosId(idAlumno);
//    }


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

        // ACA Validar que el grupo tenga luga disponible


        grupoExistente.agregarHorario(horario);
        grupoRepository.save(grupoExistente);
    }

/*
    // REdefinir: servicioService deberia buscar el servicio y pasarselo por parametros?
    public void agregarAlumnoAGrupo(Long idServicio, Integer numGrupo, Long idAlumno) {
        // Tengo que saber de que servicio es este grupo
        Servicio servicio = servicioService.findServicio(idServicio);

        // Buscamos el alumno y el grupo
        Grupo grupoExistente = servicio.obtenerGrupoConEsteNum(numGrupo);
        Alumno alumnoExistente = alumnoService.findAlumno(idAlumno);


        // REVISAR si tambien puede estar esperando la aceptacion de una inscripcion
        // Validar que el alumno este inscripto ACTUALMENTE en el servicio de ese grupo
        if (! alumnoExistente.estaInscriptoAEsteServicio(servicio)) {
            throw new UnsupportedOperationException("El alumno no está inscripto en este servicio.");
        }

        // Validar que el alumno no esté previamente en ese grupo? Se resuelve con set?
        grupoExistente.agregarAlumno(alumnoExistente); // Aqui se valida que el grupo tenga cupos
        grupoRepository.save(grupoExistente);

        // SI SE CAMBIA UN ALUMNO DE GRUPO SE DEBE VALIDAR QUE SE AGREGUE A LAS CLASES FUTURAS DE ESE GRUPO
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

        //REVISAR QUE NO DEBERIA QUEDAR SIN GRUPO SINO QUE SE DEBERIA CAMBIAR DE GRUPO
        // SI SE CAMBIA UN ALUMNO DE GRUPO SE DEBE VALIDAR QUE SE AGREGUE A LAS CLASES FUTURAS DE ESE GRUPO
    }
*/
}
