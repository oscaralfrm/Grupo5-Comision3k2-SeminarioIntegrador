package com.harp.backend.entities.inscripcion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.AlumnoService;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.grupo.GrupoService;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.HorarioService;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.EstrategiaCrearInscripcionFactory;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.IEstrategiaInscripcion;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.instructor.InstructorService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

//REVISAR Agregar transaccional
@Service
public class InscripcionService implements IInscripcionService {

    @Autowired
    private IInscripcionRepository inscripcionRepository;

    @Autowired
    private InscripcionConverter inscripcionConverter;

    @Autowired
    private AlumnoService alumnoService;

    @Autowired
    private ServicioService servicioService;

    @Autowired
    private HorarioService horarioService;

    @Autowired
    private InstructorService instructorService;

    @Override
    public List<Inscripcion> getAllInscripciones() {
        return inscripcionRepository.findAll();
    };

    @Override
    @Transactional
    public Inscripcion createInscripcion(Long idAlumno, Long idServicio, Integer numGrupo, List<Long> idsHorarios) {
        // Se valida que exista ese alumno y ese servicio, y los obtenemos
        Alumno alumno = alumnoService.findAlumno(idAlumno);
        Servicio servicio = servicioService.findServicio(idServicio);

        //Validar que no exista previamente una inscripcion vigente asociada al alumno a ese servicio
        if (alumno.estaInscriptoAEsteServicio(servicio)) {
            throw new UnsupportedOperationException("Alumno ya inscripto al ese servicio. Editar la inscripcion.");
        }

        // Validar que no exista previamente una solicitud pendiente de inscripcion asociada al alumno
        if (alumno.estaEsperandoInscripcionAEsteServicio(servicio)) {
            throw new UnsupportedOperationException("Alumno ya ha solicitado inscripcion a ese servicio");
        }

        // Validar que haya cupos libres en el servicio
        // Se calculan la cantidad de inscripciones vigentes en el servicio. Se lo comparan con la cantMaxAlumnos
//        Integer cantInscripcionesVigentes = this.findInscripcionesVigentesDeServicio(idServicio).size();
//        if (servicio.tieneCuposLibres(cantInscripcionesVigentes)) {
//            throw new  UnsupportedOperationException("No hay mas cupos libres en este servicio.");
//        }


        IEstrategiaInscripcion estrategiaInscripcion = EstrategiaCrearInscripcionFactory.getEstrategia(servicio.getModalidad());
        Inscripcion inscripcionCreada = estrategiaInscripcion.crearInscripcion(servicio, numGrupo, idsHorarios);

        // Si es modalidad de horarios de las clases:
        // si es pase libre la inscripcion se hace en el grupo 1.
        // si es horarios fijos la inscripcion se hace en el grupo
        // - pase libre: si es pase libre el hayCuposLibres() lo calcula mediante la cantMax
        // - horarios fijos por grupo: hayCuposLibres() lo calcula mediante la cantidadMaxAlumnosEnEseGrupo


        inscripcionRepository.save(inscripcionCreada);
        // revisar si es mejor hacer alumnoService.agregarInscripcionAAlumno(inscripcionCreada, idAlumno);
        alumno.agregarInscripcion(inscripcionCreada);

        // Aca: generar una notificacion al instructor donde se notifique una solicitud de inscripcion
        return inscripcionCreada;
    };

    // Se puede? Es una transaccion
    @Override
    public void deleteInscripcion(Long idInscripcion){
        //Se valida que exista
        this.findInscripcion(idInscripcion);
        inscripcionRepository.deleteById(idInscripcion);
    };

    @Override
    public Inscripcion findInscripcion(Long idInscripcion){
        return inscripcionRepository.findById(idInscripcion)
                .orElseThrow(() -> new NoSuchElementFoundException("Inscripcion no encontrada"));
    };

//    public List<Inscripcion> findInscripcionesDeServicio(Long idServicio) {
//        if (!servicioService.existeServicio(idServicio)) {
//            throw new NoSuchElementFoundException("Servicio no encontrado");
//        }
//        return inscripcionRepository.findByServicioId(idServicio);
//    }

//    public List<Inscripcion> findInscripcionesVigentesDeServicio(Long idServicio) {
//        return this.findInscripcionesDeServicio(idServicio)
//                .stream()
//                .filter(Inscripcion::estaVigente)
//                .collect(Collectors.toList());
//    }

    //Revisar si se puede usar
    @Override
    public Inscripcion editInscripcion(Long idInscripcion, InscripcionDTO inscripcionDTO) {
        Inscripcion inscipcionEditada = this.findInscripcion(idInscripcion);

        //Revisar que no se estarían usando los metodos para cambiar las fechas
        inscipcionEditada = inscripcionConverter.dtoToEntity(inscripcionDTO);
        inscipcionEditada.setId(idInscripcion);
        return inscripcionRepository.save(inscipcionEditada);
    };

    public void aceptarInscripcion(Long idInscripcion, Long idInstructor) {
        // Buscar inscripcion y validar que exista
        Inscripcion inscripcionExistente = this.findInscripcion(idInscripcion);

        // Buscar el instructor con idInstructor
        Instructor instructorExistente = instructorService.findInstructor(idInstructor);

        // Validar que el servicio de la inscripcion sea del instructor loggeado O DE UN ADMIN - IMPLEMENTAR
        Grupo grupoExistente = inscripcionExistente.getGrupo();

        if (!  instructorExistente.tieneEsteGrupo(grupoExistente)) {
            throw new UnsupportedOperationException("No tiene autorización para aceptar esa inscripcion.");
        }

        // Finalmente aceptamos la inscripcion
        inscripcionExistente.aceptar();

        //Buscamos al alumno correspondiente a la inscripcion
        // Revisar que sea la mejor forma de buscar al alumno (sino agregar doble referenica entre entidades)
        Alumno alumnoExistente =  alumnoService.findAlumnoConEstaInscripcion(inscripcionExistente);

        // Si es GrupoConHorariosFijos: Agregamos el alumno a los horarios del grupo del servicio
        // Si es PaseLibre: Lo agregaríamos al servicio o al grupo/horario por default

        // Buscamos los horarios y el servicio
        //Servicio servicio = inscripcionExistente.getServicio();
        List<Horario> horariosInscripcion = inscripcionExistente.getHorarios();

        // Verificamos que todos los horarios tenga cupos libres segun cantMaxAlumnos del grupo
        for (Horario horario : horariosInscripcion) {
            if (! horario.tieneCuposLibres()) {
                throw new UnsupportedOperationException("No tiene cupos libres uno de los horarios");
            }
        }

        // Agregar al alumno a los horarios y a las clases ya creadas futuras de ese horario
        for (Horario horario : horariosInscripcion) {
            horarioService.agregarAlumnoAHorario(alumnoExistente, horario);
        }

        inscripcionRepository.save(inscripcionExistente);

        //Aca notificamos que la inscripcion ya fue aceptada
    }

    public void rechazarInscripcion(Long idInscripcion) {
        Inscripcion inscipcionExistente = this.findInscripcion(idInscripcion);
        inscipcionExistente.rechazar();
        inscripcionRepository.save(inscipcionExistente);
        // aca deberiamos notificar al alumno que su inscripcion fue rechazada
    }

    @Transactional
    public void finalizarInscripcion(Long idInscripcion) {
        Inscripcion inscipcionExistente = this.findInscripcion(idInscripcion);
        inscipcionExistente.finalizar(); // se valida que se pueda finalizar

        //ACA ELIMINAR AL ALUMNO DE LOS HORARIOS EN LOS QUE ESTA!!!! y de sus clases futuras ya creadas
        List<Horario> horarios = inscipcionExistente.getHorarios();
        Alumno alumnoExistente = alumnoService.findAlumnoConEstaInscripcion(inscipcionExistente);

        horarioService.eliminarAlumnoDeHorarios(alumnoExistente, horarios);

        // ACA ANULAR LAS CUOTAS YA CREADAS DEL ALUMNO!!!


        inscripcionRepository.save(inscipcionExistente);
        // ACA deberiamos notificar al instructor que un alumno se dio de baja
    }

}
