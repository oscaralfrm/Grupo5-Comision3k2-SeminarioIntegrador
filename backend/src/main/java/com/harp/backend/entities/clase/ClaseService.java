package com.harp.backend.entities.clase;


import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.asistencia.Asistencia;
import com.harp.backend.entities.asistencia.AsistenciaDTO;
import com.harp.backend.entities.asistencia.AsistenciaService;
import com.harp.backend.entities.diaSemana.DiaSemana;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.grupo.GrupoService;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.servicio.IServicioService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class ClaseService implements IClaseService {

    @Autowired
    private IClaseRepository claseRepository;

    @Autowired
    private IServicioService servicioService;

    @Autowired
    private AsistenciaService asistenciaService;

    @Override
    public List<Clase> getAllClases() {
        return claseRepository.findAll();
    };

    @Override
    public Clase createClaseConAsistencias(Clase clase, List<Alumno> alumnos) {
        //Creamos las asistenacias vacías de cada alumno del grupo a la clase
        for (Alumno alumno : alumnos) {
            asistenciaService.createAsistencia(alumno, clase);
        }

        return claseRepository.save(clase);
    };

    // Programa la creación de clases para ejecutarse cada domingo a la medianoche
    @Transactional
    //@Scheduled(cron = "0 40 23 * * *", zone = "America/Argentina/Buenos_Aires")
    @Scheduled(cron = "0 0 0 * * SUN", zone = "America/Argentina/Buenos_Aires")
    public void crearClasesParaLaSemanaSiguienteServicioAsistenciasActivas() {
        System.out.println("Proceso automatico creacion de clases y asistencias");
        // Obtenemos todos los servicios con sus grupos y horarios
        // REVISAR: buscar solo los que tienen asistencias activas
        List<Servicio> serviciosAsistenciasActivas = servicioService.findServiciosAsistenciasActivas();

        for (Servicio servicio : serviciosAsistenciasActivas) {
            crearClasesParaSemanaSiguente(servicio);
        }
    }

    @Override
    public void crearClasesParaSemanaSiguente(Servicio servicio) {
        Set<Grupo> grupos = servicio.getGrupos();
        // Iteramos sobre cada grupo y sus horarios para crear clases para la semana siguiente
        for (Grupo grupo : grupos) {
                this.crearClasesParaSemanaSiguienteGrupo(grupo);
            }
    }

    @Override
    public void crearClasesParaSemanaSiguienteGrupo(Grupo grupo) {
        Set<Horario> horarios = grupo.getHorarios(); // Obtener los horarios del grupo

        System.out.println("grupo" + grupo);

        // Iteramos sobre cada horario del grupo
        for (Horario horario : horarios) {
            DiaSemana diaSemanaHorario = horario.getDiaSemana();
            DayOfWeek dayOfWeek = diaSemanaHorario.toDayOfWeek();

            // Calcular la próxima fecha para el día del horario
            LocalDate fechaClase = LocalDate.now().with(dayOfWeek);

            // Si el día obtenido es hoy osea es domingo o ya pasó, ajustamos a la semana siguiente
            // Los domingos a primera hora se crean las clases desde el lunes hasta el doming siguiente
            if (!fechaClase.isAfter(LocalDate.now())) {
                fechaClase = fechaClase.plusWeeks(1);
            }

            // Crear y guardar la clase
            Clase nuevaClase = new Clase();
            nuevaClase.setFecha(fechaClase);
            nuevaClase.setHorario(horario);
            grupo.agregarClase(nuevaClase);
            System.out.println("nueva clase" + nuevaClase);

            this.createClaseConAsistencias(nuevaClase, horario.getAlumnos());
        }
    }

    @Override
    public void deleteClase(Long idClase){
        Clase claseExistente = this.findClase(idClase);
        claseRepository.deleteById(idClase);
    };

    @Override
    public Clase findClase(Long idClase){
        return claseRepository.findById(idClase)
                .orElseThrow(() -> new NoSuchElementFoundException("Clase no encontrado"));
    };

    public List<Clase> findClasesDeGrupo(Long idGrupo) {
        return claseRepository.findClasesDeGrupo(idGrupo);
    }

    public List<Clase> findClasesDeHorario(Horario horario) {
        return claseRepository.findByHorario(horario);
    }

    public List<Clase> findClasesFuturasDeHorario(Horario horario) {
        return this.findClasesDeHorario(horario).stream().filter(Clase::esFutura).toList();
    }

    @Override
    public Clase editClase(Long idClase, ClaseDTO claseDTO) {
        Clase clase = this.findClase(idClase);
        clase.setObservaciones(claseDTO.getObservaciones());
        clase.setNoFueDada(claseDTO.isNoFueDada());

        return claseRepository.save(clase);
    };

    @Override
    public void cambiarClaseANoFueDada(Long idClase) {
        Clase clase = this.findClase(idClase);
        clase.setNoFueDada(true);
        claseRepository.save(clase);
    };

    public void agregarAsistenciasDeAlumnoNuevoAClasesFuturas(Alumno alumnoNuevo, Horario horario) {
        List<Clase> claseFuturasHorario = findClasesFuturasDeHorario(horario);
        System.out.println(33);
        for (Clase clase : claseFuturasHorario) {
            asistenciaService.createAsistencia(alumnoNuevo, clase);
        }
        System.out.println(34);
    }

    public void eliminarAsistenciasDeAlumnoDeClasesFuturas(Alumno alumnoExistente, Horario horario) {
        List<Clase> claseFuturasHorario = findClasesFuturasDeHorario(horario);
        for (Clase clase : claseFuturasHorario) {
            asistenciaService.deleteAsistenciasDeAlumnoAndClase(alumnoExistente, clase);
        }
    }

}
