package com.harp.backend.entities.clase;


import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.asistencia.Asistencia;
import com.harp.backend.entities.asistencia.AsistenciaDTO;
import com.harp.backend.entities.asistencia.AsistenciaService;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.cuota.CuotaService;
import com.harp.backend.entities.diaSemana.DiaSemana;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.grupo.GrupoService;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.inscripcion.InscripcionService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ClaseService implements IClaseService {

    @Autowired
    private IClaseRepository claseRepository;

    @Autowired
    private AsistenciaService asistenciaService;

//    @Autowired
//    private CuotaService cuotaService;

    @Override
    public List<Clase> getAllClases() {
        return claseRepository.findAll();
    };

    @Override
    public Clase createClaseConAsistencias(Clase clase, List<Inscripcion> inscripciones) {
        //Creamos las asistenacias vacías de cada alumno del grupo a la clase
        for (Inscripcion inscripcion : inscripciones) {
            asistenciaService.createAsistencia(inscripcion, clase);
        }

        return claseRepository.save(clase);
    };


    public void crearClasesParaSemanaSiguente(Servicio servicio, LocalDate fechaInicio) {
        // Fecha inicio podria ser null
        // O podria ser la fecha de inicio del servicio a partir de la cual se quiere crear las clases
        Set<Grupo> grupos = servicio.getGrupos();
        // Iteramos sobre cada grupo y sus horarios para crear clases para la semana siguiente
        for (Grupo grupo : grupos) {
                this.crearClasesParaSemanaSiguienteGrupo(servicio, grupo, fechaInicio);
            }
    }


    @Override
    public void crearClasesParaSemanaSiguienteGrupo(Servicio servicio, Grupo grupo, LocalDate fechaInicio) {
        Set<Horario> horarios = grupo.getHorarios(); // Obtener los horarios del grupo
        //System.out.println("horarios2" + horarios);
        //System.out.println("grupo" + grupo);

        // Iteramos sobre cada horario del grupo
        for (Horario horario : horarios) {
            crearClasesParaSemanaSiguienteHorario(servicio, grupo, fechaInicio, horario);
        }
    }

    public void crearClasesParaSemanaSiguienteHorario(Servicio servicio, Grupo grupo, LocalDate fechaInicio, Horario horario) {
        DiaSemana diaSemanaHorario = horario.getDiaSemana();
        DayOfWeek dayOfWeek = diaSemanaHorario.toDayOfWeek();

        if (fechaInicio == null) {
            fechaInicio = LocalDate.now();
        }

        // Calcular la próxima fecha para el día del horario
        LocalDate fechaClase = fechaInicio.with(dayOfWeek);

        // Si el día obtenido es hoy osea es domingo o ya pasó, ajustamos a la semana siguiente
        // Los domingos a primera hora se crean las clases desde el lunes hasta el doming siguiente
        // agregamos el equal para que si la fecha de inicio es hoy se cree la clase de hoy
        if (!fechaClase.isAfter(fechaInicio) && ! fechaClase.isEqual(fechaInicio)) {
            fechaClase = fechaClase.plusWeeks(1);
        }

        // Crear y guardar la clase
        Clase nuevaClase = new Clase();
        nuevaClase.setFecha(fechaClase);
        nuevaClase.setHorario(horario);
        grupo.agregarClase(nuevaClase);

        // Aca tenemos que buscar las inscripciones vigentes del grupo
        this.createClaseConAsistencias(nuevaClase, servicio.obtenerInscripcionesVigentes());
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

//    public List<Clase> obtenerClasesPasadasDeGrupo(Grupo grupo) {
//        List<Clase> clases = this.findClasesDeGrupo(grupo.getId());
//        List<Clase> clasesPasadas =  clases.stream().filter(clase -> ! clase.esFutura()).toList();
//        return clasesPasadas;
//    }

    public List<Clase> obtenerClasesPasadasDeGrupoEn(Long  idGrupo, Month month, Year year) {
        List<Clase> clases = this.findClasesDeGrupo(idGrupo);

        Stream<Clase> clasesPasadas = clases.stream();
        // Devolvemos todas las clases pasadas del grupo
        if (month == null && year == null) {
            clasesPasadas = clasesPasadas.filter(clase -> ! clase.esFutura());
        }
        // Devolvemos las clases pasadas del mes de este año
        if (month != null && year == null) {
            clasesPasadas = clasesPasadas.filter(clase -> ! clase.esFutura() &&
                    clase.esDeEsteMes(month) && clase.esDeEsteAnio(Year.now()));
        }
        //Devolvemos las clases pasadas del año pedido
        if (month == null && year != null) {
            clasesPasadas = clasesPasadas.filter(clase -> ! clase.esFutura() && clase.esDeEsteAnio(year));
        }

        return clasesPasadas.toList();
    }

    public List<Clase> obtenerClasesNoDadasDeGrupoEn(Grupo grupo, Month month, Year year) {
        List<Clase> clases = this.findClasesDeGrupo(grupo.getId());
        Stream<Clase> clasesNoDadas = clases.stream();
        // Devolvemos todas las clases no dadas del grupo
        if (month == null && year == null) {
            clasesNoDadas = clasesNoDadas.filter(Clase::isNoFueDada);
        }
        // Devolvemos las clases no dadas del mes de este año
        if (month != null && year == null) {
            clasesNoDadas = clasesNoDadas.filter(clase -> clase.isNoFueDada() &&
                    clase.esDeEsteMes(month) && clase.esDeEsteAnio(Year.now()));
        }
        //Devolvemos las clases no dadas del año pedido
        if (month == null && year != null) {
            clasesNoDadas = clasesNoDadas.filter(clase -> clase.isNoFueDada() && clase.esDeEsteAnio(year));
        }
        if (month != null && year != null) {
            clasesNoDadas = clasesNoDadas.filter(clase -> clase.isNoFueDada() && clase.esDeEsteMes(month)&& clase.esDeEsteAnio(year));
        }
        return clasesNoDadas.toList();
    }

    public List<Clase> findUltimasClasesDeGrupo(Long idGrupo, int cantClases) {
        // Primero obtenemos todas las clases del grupo
        List<Clase> clases = this.findClasesDeGrupo(idGrupo);

        // Ordenamos las clases por fecha de forma descendente, es decir,
        // las clases más recientes primero
        clases.sort(Comparator.comparing(Clase::getFecha).reversed());

        // Tomamos las primeras 'cantidad' clases de la lista ordenada
        return clases.stream()
                .limit(cantClases)
                .collect(Collectors.toList());

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

    public void cambiarClaseANoFueDada(Long idClase) {
        Clase clase = this.findClase(idClase);
        clase.setNoFueDada(true);
        claseRepository.save(clase);
    }

    @Override
    public void cambiarClaseAFueDada(Long idClase) {
        Clase clase = this.findClase(idClase);
        clase.cambiarAFueDada();
        claseRepository.save(clase);
    };

    public void agregarAsistenciasDeAlumnoNuevoAClasesFuturas(Inscripcion inscripcionNueva, Horario horario) {
        List<Clase> claseFuturasHorario = findClasesFuturasDeHorario(horario);
        for (Clase clase : claseFuturasHorario) {
            asistenciaService.createAsistencia(inscripcionNueva, clase);
        }
    }

    public void eliminarAsistenciasDeAlumnoDeClasesFuturasDeHorario(Alumno alumnoExistente, Horario horario) {
        List<Clase> claseFuturasHorario = findClasesFuturasDeHorario(horario);
        for (Clase clase : claseFuturasHorario) {
            asistenciaService.deleteAsistenciasDeAlumnoAndClase(alumnoExistente, clase);
        }
    }

    public void eliminarAsistenciasDeAlumnoDeClasesFuturasDeGrupo(Alumno alumnoExistente, Grupo grupo) {
        for (Horario horario : grupo.getHorarios()) {
            List<Clase> claseFuturasHorario = findClasesFuturasDeHorario(horario);
            for (Clase clase : claseFuturasHorario) {
                asistenciaService.deleteAsistenciasDeAlumnoAndClase(alumnoExistente, clase);
            }
        }
    }

    public void eliminarClasesDeServicio(Servicio servicio) {
        Set<Grupo> gruposServicio = servicio.getGrupos();
        for (Grupo grupo : gruposServicio) {
            this.eliminarClaseDeGrupo(grupo);
        }
    }

    public void eliminarClaseDeGrupo(Grupo grupo) {
        Set<Clase> clasesGrupo = grupo.getClases();
        for (Clase clase : clasesGrupo) {
            this.deleteClase(clase.getId());
        }
    }

    @Override
    public Clase borrarObservaciones(Long idClase) {
        Clase clase = this.findClase(idClase);
        clase.setObservaciones(null); // Borramos las observaciones
        return claseRepository.save(clase);
    }
}
