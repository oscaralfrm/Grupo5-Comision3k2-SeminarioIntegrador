package com.harp.backend.entities.grupo;

import ch.qos.logback.core.rolling.helper.MonoTypedConverter;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.AlumnoService;
import com.harp.backend.entities.asistencia.Asistencia;
import com.harp.backend.entities.asistencia.AsistenciaResumenDTO;
import com.harp.backend.entities.asistencia.AsistenciaService;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.clase.ClaseService;
import com.harp.backend.entities.clase.IClaseService;
import com.harp.backend.entities.diaSemana.DiaSemana;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.historialMontoCuota.MontoServicioDTO;
import com.harp.backend.entities.historialMontoCuota.MontoServicioService;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.HorarioConverter;
import com.harp.backend.entities.horario.HorarioDTO;
import com.harp.backend.entities.horario.IHorarioService;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.notificacion.NotificacionService;
import com.harp.backend.entities.servicio.IServicioService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

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

    @Autowired
    private IHorarioService horarioService;

    @Autowired
    private ClaseService claseService;

    @Autowired
    private MontoServicioService montoService;

    @Autowired
    private HorarioConverter horarioConverter;

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private AsistenciaService asistenciaService;

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
    @Transactional
    public Grupo createGrupo(GrupoDTO grupoDTO, Long idServicio) {
        //Aca se deberia busar el ultimo numero y sumarle 1
        Grupo nuevoGrupo = grupoConverter.dtoToEntity(grupoDTO);
        Grupo grupoCreado = grupoRepository.save(nuevoGrupo);
        // Agregamos el grupo al servicio
        Servicio servicio = servicioService.findServicio(idServicio);
        servicioService.agregarGrupoAServicio(nuevoGrupo, servicio);

        // Agregamos el monto al grupo
        MontoServicio nuevoMonto = montoService.createMontoGrupo(grupoDTO.getMonto(), LocalDate.now());
        grupoCreado.agregarMontoAHistorial(nuevoMonto);

        return grupoCreado;
    };

    public boolean validarSuperposicionHorarios(Servicio servicio, HorarioDTO horarioDTO) {
        boolean noCumple = servicio.tienGrupoEnEsteHorario(horarioDTO.getHoraInicio(),
                horarioDTO.getHoraFin(),
                horarioDTO.getNombreDiaSemana());
        return noCumple;
    }

    @Transactional
    @Override
    public Grupo createGrupoConHorarios(GrupoDTO grupoDTO, Long idServicio) {
        //Grupo grupoCreado = this.createGrupo(grupoDTO, idServicio);
        Grupo nuevoGrupo = grupoConverter.dtoToEntity(grupoDTO);
        Grupo grupoCreado = grupoRepository.save(nuevoGrupo);
        Servicio servicio = servicioService.findServicio(idServicio);
        servicioService.agregarGrupoAServicio(nuevoGrupo, servicio);

        // Agregamos el monto al grupo
        // Si el servicio tiene fecha inicio y todavia no inicio entonces la fecha de inicio del monto es la fecha inicio del servicio
        // Si el servicio no tiene fecha inicio entonces se crea con fecha inicio null y luego se setteara
        // Si el servicio ya inicio entonces se crea con fecha inicio la actual
        LocalDate fechaInicioMonto;
        if (servicio.tieneFechaInicio() ) {
            if ( ! servicio.yaInicio()) {
                // Si el servicio ya tiene fecha inicio configurada y no inicio
                // será a partir de esa fecha que se comenzará a cobrar
                fechaInicioMonto = servicio.getFechaInicio();
            } else {
                // Si el servicio ya inició entonces tiene fecha de inicio
                // el grupo que se esta creando es nuevo por lo que se comenzara a cobrar desde el dia de hoy
                fechaInicioMonto = LocalDate.now();
            }
        } else {
            // El servicio todavia no inicio y no se configuró la fecha inicio
            // La fecha del monto se configurara junto con la fecha de inicio del servicio
            fechaInicioMonto = null;
        };

        MontoServicio nuevoMonto = montoService.createMontoGrupo(grupoDTO.getMonto(), fechaInicioMonto);
        grupoCreado.agregarMontoAHistorial(nuevoMonto);

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
        // REVISAR SI SE LLAMA CUANDO SE INICIE REALMENTE EL SERVICIO
        if (servicio.isAsistenciasActivas() && servicio.tieneFechaInicio()) {
            // Creamos las clases a partir de la fecha inicio del servicio
            // Cuando setteamos la fecha inicio tambien deberiamos crear las clases
            claseService.crearClasesParaSemanaSiguienteGrupo(servicio, grupoCreado, servicio.getFechaInicio());
        }

        return grupoCreado;
    }

    public void agregarHorariosAGrupo(List<HorarioDTO> horariosDTO, Long idGrupo, Long idServicio) {
        Grupo grupoExistente = findGrupo(idGrupo);
        Servicio servicio = servicioService.findServicio(idServicio);

        // ACA Validar
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
            grupoExistente.agregarHorario(horario);
        }

        grupoRepository.save(grupoExistente);

        // Aca creamos las clases para ese horario
        if (servicio.isAsistenciasActivas() && servicio.tieneFechaInicio()) {

            // Creamos las clases a partir de la fecha inicio del servicio
            // Cuando setteamos la fecha inicio tambien deberiamos crear las clases
            for (Horario horario : horarios) {

                claseService.crearClasesParaSemanaSiguienteHorario(servicio, grupoExistente, servicio.getFechaInicio(), horario);
            }
        }
    }

    public void agregarMontoAGrupo(MontoServicio montoServicio, Grupo grupoExistente) {
        grupoExistente.agregarMontoAHistorial(montoServicio);
        grupoRepository.save(grupoExistente);
    }

    public MontoServicio obtenerMontoActualGrupo(Long idGrupo) {
        Grupo grupo = this.findGrupo(idGrupo);
        return grupo.obtenerMontoActual();
    }

    public MontoServicio obtenerMontoProgramadoFuturoGrupo(Long idGrupo) {
        Grupo grupo = this.findGrupo(idGrupo);
        return grupo.obtenerMontoFuturo();
    }


    public MontoServicio actualizarYCrearNuevoMonto(MontoServicioDTO montoServicioDTO, Long idGrupo, Long idServicio) {
        // ESTO ES PARA GRUPOS CON HORARIOS FIJOS DONDE LOS ALUMNOS SE INSCRIBEN A TODOS LOS HORARIOS DE UN GRUPO

        // Solo el dejamos crear/programar UN SOLO monto futuro
        // Entonces le preguntamos al grupo si tiene un monto programado futuro

        Servicio servicio = servicioService.findServicio(idServicio);

        Grupo grupo = servicio.obtenerGrupoConEsteId(idGrupo);
        if (grupo.tieneMontoProgramadoFuturo()) {
            throw new UnsupportedOperationException("El grupo ya tiene un monto programado. Edite este monto.");
        }

//        // Le pedimos a la estrategia AGrupos, AHorarios, AServicio que es quien sabe cual
//        // frecuencia semanal hay que tener en cuenta de esas tres entidades
//        // si es AServicio entonces nos fijamos si servicio tiene esa frecuencia semanal
//        // Si es a grupos entonces nos fijamos si hay alguno que tenga esa frecuencia semanal
//        // Y si es a horarios??? REVISAR ESTO
//        Integer cantVecesSemanales = montoServicioDTO.getCantVecesSemanales();
//        IEstrategiaInscripcion estrategiaModalidadInscrip = EstrategiaCrearInscripcionFactory
//                .getEstrategia(servicio.getModalidadInscripcion());
//        if (! estrategiaModalidadInscrip.tieneEstasVecesSemanales(servicio, cantVecesSemanales)) {
//            throw new UnsupportedOperationException("El servicio no tiene esa frecuencia de asistencia semanal");
//        }

        MontoServicio nuevoMontoGrupo;

        // Solo si hay un monto actual le settamos la fecha fin
        // Si es el primer monto del servicio entonces no tendrá ningun motno actual configurado
        // VALIDAR Y si tiene un monto actual configurado pero no para esa frecuencia semanal?
        if (grupo.tieneMontoActualConfigurado()) {

            // Solo le dejamos crear un monto nuevo MINIMO con fecha inicio el dia siguente al actual
            // Validamos que la fechaInicio del monto del servicio que se quiere crear es Mayor a la actual
            LocalDate fechaActual = LocalDate.now();
            if (montoServicioDTO.getFechaInicio().isEqual(fechaActual) ||
                    montoServicioDTO.getFechaInicio().isBefore(fechaActual)) {
                throw new UnsupportedOperationException("No se puede configurar un monto para una fecha anterior o igual a la actual");
            }

            // Crear el nuevo monto
            nuevoMontoGrupo = montoService.createMontoServicio(montoServicioDTO);

            MontoServicio montoActual = grupo.obtenerMontoActual();
            // La fecha fin del monto actual será un dia antes que la nueva
            // Si se define para mañana la fecha inicio, entonces la fecha fin del monto anterior es de hoy
            montoService.cambiarFechaFinMontoServicio(montoActual, nuevoMontoGrupo.getFechaInicio()); // Persistimos el cambio en la fecha fin
        } else {
            MontoServicioDTO dtoConFecha;
            if (servicio.getFechaInicio() == null) {
                dtoConFecha = new MontoServicioDTO(montoServicioDTO.getMonto(), null);
            } else if (servicio.yaInicio()) {
                dtoConFecha = new MontoServicioDTO(montoServicioDTO.getMonto(), LocalDate.now());
            } else {
                dtoConFecha = new MontoServicioDTO(montoServicioDTO.getMonto(), servicio.getFechaInicio());
            }

            //MontoServicioDTO dtoSinFecha = new MontoServicioDTO(montoServicioDTO.getMonto(), null);

            // Crear el nuevo monto
            nuevoMontoGrupo = montoService.createMontoServicio(dtoConFecha);
        }

        // Asociar el nuevo monto al servicio
        this.agregarMontoAGrupo(nuevoMontoGrupo, grupo);

        // Notificamos a los alumnos la actualizacion del monto
        // titulo: actualizacion de monto
        // el dia nuevoMonto.getFechaInicio() el grupo grupo.getNombre() del servicio servicio.getNombre() va a valer nuevoMonto.getMonto()

        notificacionService.notificarActualizacionMonto(servicio, grupo, nuevoMontoGrupo);

        return nuevoMontoGrupo;
    }

    public void actualizarYCrearVariosNuevosMontos(MontoServicioDTO montoDTO, List<Long> idsGrupos, Long idServicio) {
        List<Grupo> grupos = new ArrayList<>();
        Servicio servicio = servicioService.findServicio(idServicio);

        // Verificamos que sea valido modificar el monto de todos los grupos que nos llegan en la lista de ids
        // Si pueden ser modificados los agregamos a la lista de grupos
        for (Long idGrupo : idsGrupos) {
            Grupo grupo = servicio.obtenerGrupoConEsteId(idGrupo);

            if (grupo.tieneMontoProgramadoFuturo()) {
                throw new UnsupportedOperationException("El grupo ya tiene un monto programado. Edite este monto.");
            }
            grupos.add(grupo);
        }

        // Ahora sabiendo que a todos los grupos se le puede modificar su monto lo hacemos
        for (Grupo grupo : grupos) {
            this.actualizarYCrearNuevoMonto(montoDTO, grupo.getId(), idServicio);
        }
    }

    public MontoServicio editMontoGrupoProgramado(Long idServicio, Long idGrupo, MontoServicioDTO montoServicioDTO) {
        Servicio servicio = servicioService.findServicio(idServicio);
        Grupo grupo = this.findGrupo(idGrupo);
        if (! grupo.tieneMontoProgramadoFuturo()) {
            throw new UnsupportedOperationException("El grupo no tiene un monto programado a futuro para editar");
        }
        MontoServicio montoProgramadoActual = grupo.obtenerMontoFuturo();

        MontoServicio montoActual = grupo.obtenerMontoActual();

        // Si el servicio no tiene alumnos el monto puede modificarse siempre
        if (montoProgramadoActual.puedeSerModificado() || ! servicio.tieneAlumnosConInscripcionesActivas()) {
             MontoServicio montoEditado = montoService.editMontoServicio(montoProgramadoActual.getId(), montoServicioDTO);
             montoService.cambiarFechaFinMontoServicio(montoActual, montoEditado.getFechaInicio());
             return montoEditado;
        } else {
            throw new UnsupportedOperationException("El monto ya no puede ser modificado.");
        }
    }

    public Set<MontoServicio> obtenerHistorialMontosDeGrupo(Long idGrupo) {
        Grupo grupo = this.findGrupo(idGrupo);
        return grupo.getHistorialMontos();
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
        grupoExistente.setNombre(grupoDTO.getNombre());
        grupoExistente.setCantMaxAlumnos(grupoDTO.getCantMaxCupos());
        if (grupoDTO.getMonto() != null && grupoDTO.getMonto() != 0) {
            obtenerMontoActualGrupo(grupoExistente.getId()).setMonto(grupoDTO.getMonto());
        }
        return grupoRepository.save(grupoExistente);
    };

    // ESTADISTICAS DE ASISTENCIAS DE GRUPO

    public List<Clase> obtenerClasesPasadasDeGrupo(Grupo grupo, Month month, Year year) {
        return claseService.obtenerClasesPasadasDeGrupoEn(grupo.getId(), month, year);
    }

    public List<Asistencia> obtenerAllAsistenciasDeGrupo(Grupo grupo, Month month, Year year) {
        return servicioService.obtenerAllAsistenciasDeGrupo(grupo, month, year);
    }

    public List<Asistencia> obtenerAllInasistenciasDeGrupo(Grupo grupo, Month month, Year year) {
        return servicioService.obtenerAllInasistenciasDeGrupo(grupo, month, year);
    }

    public double calcularPorcentajePromedioAsistenciaDeGrupo(Long idGrupo, Month month, Year year) {
        return servicioService.calcularPorcentajePromedioAsistenciaDeGrupo(idGrupo, month, year);
    }

//    public String calcularMotivoMasFrecuenteDeAusencia(Grupo grupo) {
//        List<Asistencia> allInasistencias = this.obtenerAllInasistenciasDeGrupo(grupo);
//        Map<String, Integer> motivos = new HashMap<>();
//        for (Asistencia asistencia : allInasistencias) {
//            motivos.put(asistencia.getObservaciones(), motivos.get(asistencia.getObservaciones()) + 1 );
//        }
//        Integer maximoValor = motivos.values().stream().max();
//        return motivos.
//
//    }

    public List<Alumno> calcularAlumnosConMasFaltas(Grupo grupo, Month month, Year year) {
        return servicioService.calcularAlumnosConMasFaltas(grupo, month, year);
    }

    public List<Alumno> calcularAlumnosConMenosFaltas(Grupo grupo, Month month, Year year) {
        return servicioService.calcularAlumnosConMenosFaltas(grupo, month, year);
    }

    public Set<Alumno> calcularAlumnosConAsistenciaPerfecta(Grupo grupo, Month month, Year year) {
        return servicioService.calcularAlumnosConAsistenciaPerfecta(grupo, month, year);
    }

    public List<Clase> obtenerUltimasClasesDeGrupo(Grupo grupo, int cantClases) {
        if (cantClases == 0) {
            return new ArrayList<>();
        }
        List<Clase> ultimasClases = claseService.findUltimasClasesDeGrupo(grupo.getId(), cantClases);
        return ultimasClases;
    }

    public Set<Alumno> calcularAlumnosAusentesUltimasClases(Grupo grupo, int cantClases) {
        List<Clase> ultimasClases = this.obtenerUltimasClasesDeGrupo(grupo, cantClases);

        if (ultimasClases.isEmpty()) {
            return new HashSet<>();
        }

        // Agregamos los alumnos que estan en la lista de inasitencias de todas las ultimas clases
        Set<Alumno> alumnosAusentesUnaClase = asistenciaService
                .findInasistenciasDeClase(ultimasClases.get(0).getId())
                .stream().map(asistencia -> asistencia.getInscripcion().getAlumno()).collect(Collectors.toSet());

        // Recorremos los alumnos ausentes una clase
        // De esos filtramos los alumnos que para todas las ultimas clases, tiene alguna inasistencia que es de él
        Set<Alumno> alumnosAusentesUltimasClases =
                alumnosAusentesUnaClase
                .stream().filter(alumno ->
                        ultimasClases
                                .stream()
                                .allMatch(clase ->
                                        asistenciaService
                                                .findInasistenciasDeClase(clase.getId())
                                                .stream()
                                                .anyMatch(asistencia -> asistencia.esDeEsteAlumno(alumno)) ))
                        .collect(Collectors.toSet());

        return alumnosAusentesUltimasClases;
    }

    public EstadisticasGrupoDTO obtenerEstadisticasGrupo(Long idGrupo, Month month, Year year) {
        Grupo grupo = this.findGrupo(idGrupo);
        double porcentajeAsistenciasGrupo = this.calcularPorcentajePromedioAsistenciaDeGrupo(idGrupo, month, year);
//        String motivoMasFrecuenteAusencia = this.calcularMotivoMasFrecuenteDeAusencia(idGrupo);

        List<Alumno> alumnosConMasFaltas = this.calcularAlumnosConMasFaltas(grupo, month, year);
        List<Alumno> alumnosConMenosFaltas = this.calcularAlumnosConMenosFaltas(grupo, month, year);
        Set<Alumno> alumnosConAsistenciaPerfecta = this.calcularAlumnosConAsistenciaPerfecta(grupo, month, year);
        Set<Alumno> alumnosAusentesUltimasTresClases = this.calcularAlumnosAusentesUltimasClases(grupo,3);


        return new EstadisticasGrupoDTO(porcentajeAsistenciasGrupo,
                                        alumnosConMasFaltas,
                                        alumnosConMenosFaltas,
                                        alumnosConAsistenciaPerfecta,
                                       alumnosAusentesUltimasTresClases);
    }


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

    public void eliminarAsistenciasDeAlumnoDeClasesFuturasDeGrupo(Alumno alumnoExistente, Grupo grupo) {
        claseService.eliminarAsistenciasDeAlumnoDeClasesFuturasDeGrupo(alumnoExistente, grupo);
    }
}
