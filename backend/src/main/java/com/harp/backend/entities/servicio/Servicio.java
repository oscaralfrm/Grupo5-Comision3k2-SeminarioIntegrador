package com.harp.backend.entities.servicio;

//import com.harp.backend.entities.grupo.Grupo;
//import com.harp.backend.entities.historialMontoCuota.HistorialMonto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.diaSemana.DiaSemana;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPago;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.Turno;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.modalidad.Modalidad;
import com.harp.backend.entities.modalidad.ModalidadClases;
import com.harp.backend.entities.pagos.Pago;
import com.harp.backend.entities.resenia.Resenia;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Stream;

@Setter
@Getter
@NoArgsConstructor

@Entity
@Table(name = "servicios")
public class Servicio {

    public Servicio(String nombre, String descripcion, String logoURL, String ubicacion,
                    Integer cantMaxAlumnosPorGrupo, int duracionTotalMeses,
                    LocalDate fechaInicio, LocalDate fechaFin,
                    boolean publico, int cantDiasCiclo, int diaLimitePago,
                    boolean claseDePrueba, boolean asistenciasActivas,
                    boolean pagoAnticipadoDeMontoInscripcion, boolean pagoAnticipadoDePrimeraCuota,
                    int diasDeAntelacionPago , double montoInscripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.logoURL = logoURL;
        this.ubicacion = ubicacion;
        this.cantMaxAlumnosPorGrupo = cantMaxAlumnosPorGrupo;
        this.cantVecesSemanales = cantVecesSemanales;
        //this.cantHorariosPorGrupo = cantHorariosPorGrupo;
        this.duracionTotalMeses = duracionTotalMeses;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.publico = publico;
        this.cantDiasCiclo = cantDiasCiclo;
        this.diaLimitePago = diaLimitePago;
        this.claseDePrueba = claseDePrueba;
        this.asistenciasActivas = asistenciasActivas;

        this.pagoAnticipadoDeMontoInscripcion = pagoAnticipadoDeMontoInscripcion;
        this.pagoAnticipadoDePrimeraCuota = pagoAnticipadoDePrimeraCuota;
        this.diasDeAntelacionPago = diasDeAntelacionPago;
        this.montoInscripcion = montoInscripcion;

        // Valores predeterminados o inicializados por defecto
        this.fechaCreacion = LocalDate.now(); // Fecha de creación en la fecha actual
        this.activo = false;                  // Por defecto, el servicio no está activo
        this.grupos = new HashSet<>();          // Inicializa los grupos vacíos
        this.inscripcionesAbiertas = false;
        this.resenias = new ArrayList<>();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;
    private String logoURL;
    private String ubicacion;

    @Enumerated(EnumType.STRING)
    private EstadoServicio estado = EstadoServicio.Borrador;

    @ManyToOne
    @JoinColumn(name = "categoria_id", referencedColumnName = "id")
    private Categoria categoria;

    //Revisar valor por defecto null o cero
    @Column(name = "cant_max_alumnos_por_grupo")
    private Integer cantMaxAlumnosPorGrupo;

    private Integer cantMaxAlumnos;
//    @Column(name = "cant_veces_semanales")
    private Integer cantVecesSemanales;
//    private Integer cantHorariosPorGrupo;

    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion = LocalDate.now(); //No puede modificarse

    // Si un alumno se inscribe el 10/05 y duracion es 5meses, entonces finaliza el 10/10
    // Cuando se cree una inscripcion tendrá fecha fin = fecha actual + servicio.duracionTotalMeses
    @Column(name = "duracion_inscripcion")
    private Integer duracionTotalMeses;

    //Sin importar cuando el alumno se inscriba el servicio termina esta fecha
    // Cuando se cree una inscripcion tendrá esta fecha fin programada

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    // Por defecto es false
    private boolean activo = false; //activo = que se esta cobrando
    private boolean publico; //publico = que se publicita

    @Setter(AccessLevel.NONE)
    private boolean inscripcionesAbiertas; // cargar en base de datos

    // es != null si no es cada X cant dias
    @Column(name = "cant_dias_ciclo")
    private Integer cantDiasCiclo;

    //Cuando se creen las cuotas tendrán como fecha limite esta fecha
    @Column(name = "dia_limite_pago")
    private Integer diaLimitePago;

//    @OneToMany
//    @JoinColumn(name = "servicio_id")
//    @JsonIgnore
//    private Set<MontoServicio> historialMontos = new HashSet<>();

    @OneToMany
    @JoinColumn(name = "servicio_id")
    @JsonIgnore
    private List<Inscripcion> inscripciones;

    // Servicio tiene una frecuencia de pago o varias?
    // Se usa al crear las cuotas, si el servicio cambia cada cuanto cobra las cuotas
    // entonces las proximas cuotas a cobrar se cobraran asi
    // yo creo cuotas antes de que se finalice la anterior y esas cuotas quizas quedan con otra frecuencia de pago
    // deberia crear las cuotas cuando se finaliza la anterior
    @ManyToOne
    @JoinColumn(name = "tipo_frecuencia_pago_id")
    private TipoFrecuenciaPago tipoFrecuenciaPago;

    @Enumerated(EnumType.STRING)
    private Modalidad modalidadInscripcion;

    @Enumerated(EnumType.STRING)
    private ModalidadClases modalidadClases;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "servicio_id")
    @JsonIgnore
    private Set<Grupo> grupos = new HashSet<>();

    @Column(name = "clase_prueba")
    private boolean claseDePrueba;

    // hacer default = ?
    @Column(name = "asistencias_activas")
    private boolean asistenciasActivas;

    // agregar en base de datos
    private boolean pagoAnticipadoDeMontoInscripcion;
    private boolean pagoAnticipadoDePrimeraCuota;

    private Integer diasDeAntelacionPago;

    @Column(name = "monto_inscripcion")
    private double montoInscripcion;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "servicio_id")
    private List<Resenia> resenias;

    public void agregarGrupo(Grupo grupo) {
        this.grupos.add(grupo);
    }

//    public String generarCodigoInscripcion() {
//        return this.codigoInscripcion = UUID.randomUUID().toString();
//    }
//
//    public boolean validarCodigoInscripcion(String codigoIngresado) {
//        System.out.println(codigoIngresado);
//        System.out.println(this.codigoInscripcion);
//        return (codigoIngresado.equals(this.codigoInscripcion));
//    }

//    public void agregarAlumnoAGrupo(Alumno alumno, Grupo grupo) {
//        grupo.agregarAlumno(alumno);
//    }

//    public boolean tieneCuposLibres(int cantInscripcionesDeServicio) {
//        // Si la cantMaxAlumnos es null, quiere decir que no hay un máximo de alumnos, siempre hay cupos
//        // Si cantMaxAlumnos es mayor a la cantidad de inscripciones actual entonces hay cupos
//
//        return (this.cantMaxAlumnos == null || this.cantMaxAlumnos > cantInscripcionesDeServicio);
//    }

    public boolean tieneMontoEnTodosSusGrupos() {
        System.out.println("grupos" + this.getGrupos());
        return this.grupos.stream().allMatch(Grupo::tieneMontoActualConfigurado);
    }

    public boolean tieneGrupos() {
        return (! this.grupos.isEmpty());
    }

    public Grupo obtenerGrupoConEsteNum(Integer numGrupo) {
        return grupos.stream()
                .filter(g -> g.tieneEsteNumero(numGrupo))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementFoundException("No se encontró un grupo con el número: " + numGrupo + "para el servicio" + this.getId()));
    }

    public Grupo obtenerGrupoConEsteId(Long idGrupo) {
        return grupos.stream()
                .filter(g -> g.tieneEsteId(idGrupo))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementFoundException("No se encontró un grupo con el número: " + idGrupo + "para el servicio" + this.getId()));
    }

    public boolean esDeModalidadAGrupo() {
        return (modalidadInscripcion == Modalidad.AGrupo);
    }

    public boolean esDeModalidadAServicio() {
        return (modalidadInscripcion == Modalidad.AServicio);
    }

    public boolean esDeModalidadAHorarios() {
        return (modalidadInscripcion == Modalidad.AHorarios);
    }

    public boolean tieneEsteGrupo(Grupo grupo) {
        return (grupos.contains(grupo));
    }

    public boolean tieneEsteAlumno(Long idAlumno) {
        return this.obtenerAlumnosActuales().stream().anyMatch(alumno -> alumno.tieneEsteId(idAlumno));
    }

    public boolean tieneEsteAlumnoPendiente(Long idAlumno) {
        return this.obtenerAlumnosPendientesAceptacion().stream().anyMatch(alumno -> alumno.tieneEsteId(idAlumno));
    }

//    public MontoServicio obtenerMontoActualConEstasVecesSemanales(int vecesSemanales) {
//        for (MontoServicio monto : this.obtenerMontosActuales()) {
//            if (monto.esDeEstasVecesSemanales(vecesSemanales)) {
//                return monto;
//            }
//        }
//        throw new NoSuchElementFoundException("No se encontró un monto actual del servicio para esas veces semanales");
//    }

    public List<MontoServicio> obtenerMontosActualesGrupos() {
        return this.grupos.stream().map(Grupo::obtenerMontoActual).toList();
    }

    public List<MontoServicio> obtenerMontosProgramadosGrupos() {
        return this.grupos.stream().map(Grupo::obtenerMontoFuturo).toList();
    }

    public boolean tieneAlumnosConInscripcionesActivas() {
        return ( ! this.obtenerInscripcionesVigentes().isEmpty() );
    }

    public boolean tieneAlumnosConInscripcionesPendientes() {
        return ( ! this.obtenerInscripcionesPendientes().isEmpty() );
    }

//    public boolean tieneMontoActualConEstasVecesSemanales(Integer cantVecesSemanales) {
//        if (! tieneMontoActualConfigurado()) {
//            return false;
//        }
//        return historialMontos.stream().anyMatch(m -> m.esDeEstasVecesSemanales(cantVecesSemanales) );
//    }

//    public boolean tieneEstaCantVecesSemanales(int vecesSemanales) {
//        // implementar de otra forma si se le permite a los alumnos inscribirse
//        // a algunos horarios de un grupo en vez de a todos
//        return this.cantHorariosPorGrupo.equals(vecesSemanales);
//    }

    public boolean tieneFechaInicio() {
        return this.fechaInicio != null;
    }

    public boolean tieneFechaFin() {
        return this.fechaFin != null;
    }

    public List<Inscripcion> obtenerInscripciones(Grupo grupo){
        return inscripciones.stream().filter(i -> i.esDeEsteGrupo(grupo) ).toList();
    }

    public List<Inscripcion> obtenerInscripcionesVigentes() {
        return inscripciones.stream().filter(Inscripcion::estaVigente).toList();
    }

    public List<Inscripcion> obtenerInscripcionesVigentes(Grupo grupo){
        return inscripciones.stream().filter(i -> i.estaVigente() && i.esDeEsteGrupo(grupo) ).toList();
    }

    public List<Inscripcion> obtenerInscripcionesPendientes() {
        return inscripciones.stream().filter(Inscripcion::estaPendiente).toList();
    }

    public List<Inscripcion> obtenerInscripcionesPendientes(Grupo grupo){
        return inscripciones.stream().filter(i -> i.estaPendiente() && i.esDeEsteGrupo(grupo) ).toList();
    }

    public boolean tieneEstaInscripcion(Inscripcion inscripcion) {
        return (inscripciones.contains(inscripcion));
    }

    public Inscripcion obtenerInscripcionById(Long idInscripcion) {
        return inscripciones.stream()
                .filter(i -> i.getId().equals(idInscripcion))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementFoundException("Inscripción no encontrada en ese servicio"));
    }

    public boolean yaInicio() {
        // si hoy es la fecha de inicio entonces me da que no inició todavia
        // MODIFICADO: la fecha de hoy es que si inició
        return (fechaInicio != null && (fechaInicio.isBefore(LocalDate.now()) || fechaInicio.isEqual(LocalDate.now()) ) );
    }

    public boolean esSuspendido() {
        // es suspendido si esta publico e inactivo
        return (! this.isActivo() && this.isPublico());
    }

    public boolean esFinalizado() {
        // es finalizado si tiene fecha fin anterior a hoy y esta en inactivo
        return (this.fechaFin.isBefore(LocalDate.now()));
    }

    public boolean esPublicado() {
        // es publicado si esta en publico y con inscripciones abiertas
        return (this.activo && this.publico && this.inscripcionesAbiertas);
    }

    public boolean esPrivado() {
        // es privado si esta en publico y con inscripciones cerradas
        return (this.activo && this.publico && ! this.inscripcionesAbiertas);
    }

    public boolean esBorrador() {
        // es borrador si publico es false
        return (! this.publico);
    }

    public void hacerPublico() {
        this.inscripcionesAbiertas = true;
        this.setPublico(true);
        this.estado = EstadoServicio.Publicado;
    }

    public void hacerPrivado() {
        this.inscripcionesAbiertas = false;
        this.setPublico(true);
        this.estado = EstadoServicio.Privado;
    }

    // Se pueden cambios de estado

    public boolean sePuedePublicar() {
        // SI ya es publico entonces no se puede volver a configurar la fecha inicio y eso
        if (this.isPublico()) {
            return false;
        }
        // Validar que tenga los datos completos
        // servicio.tieneDatosCompletos();

        if (this.getModalidadInscripcion().equals(Modalidad.AGrupo)) {
            if ( ! this.tieneGrupos() || ! this.tieneMontoEnTodosSusGrupos() ) {
                return false;
            }
        }
        return true;
    }

    public boolean sePuedeSuspender() {
        // Se puede suspender si es publico, si ya inició y si está activo
        // Se puede suspender si yaInicio y es Publicado o Privado
        if (this.isPublico() && this.yaInicio() && this.isActivo() && ! this.tieneFechaFin()) {
            // Si el servicio inició hoy no se puede suspender
//            if (this.getFechaInicio().equals(LocalDate.now())) {
//                return false;
//            }
            // Si no tiene alumnos inscriptos o aceptados, porque ahi se eliminaria
            if (! this.tieneAlumnosConInscripcionesActivas()) {
                return false;
            }
            return true;
        }
        return false;
    }

    public boolean sePuedeFinalizar() {
        // Se puede finalizar si esta en publicado y ya inicio o en suspendido
        if (this.isPublico() && this.yaInicio() && ! this.tieneFechaFin()) {
            // Si el servicio inició hoy no se puede finalizar
//            if (this.getFechaInicio().equals(LocalDate.now())) {
//                return false;
//            }
            // si no tiene ni tuvo inscripciones tampoco
            // Si no tiene alumnos inscriptos o aceptados, porque ahi se eliminaria
            if (! this.tieneAlumnosConInscripcionesActivas()) {
                return false;
            }
            return true;
        }
        return false;
    }

    public boolean sePuedeEliminar() {
        // Se puede eliminar si es borrador, o si no tiene inscripciones
        if (this.esBorrador()
                || (! this.tieneAlumnosConInscripcionesActivas() )  ) {
            return true;
        }
        return false;
    }

    public boolean sePuedeVolverAPublicar() {
        // Se puede eliminar si es borrador, o si no tiene inscripciones
        if (this.tieneFechaInicio()
                && (! this.tieneAlumnosConInscripcionesActivas() )  ) {
            return true;
        }
        return false;
    }

    public boolean sePuedeRenaudar() {
        // Se puede eliminar si es borrador
        if (this.tieneFechaFin()) {
            return false;
        }
        return this.esSuspendido();
    }

    public boolean sePuedeCancelar() {
        // Si todavia no inició se puede cancelar
        if (this.tieneCuotasAbonadas()) {
            return false;
        }
        return (! this.yaInicio() && ! this.esBorrador() && this.tieneAlumnosConInscripcionesActivas());
    }

    public boolean tieneCuotasAbonadas() {
        return ! this.obtenerCuotasAbonadasAlumnosActuales().isEmpty();
    }

    // Cambios de estado
    public void suspender() {
        this.hacerPublico();
        this.setActivo(false);
        this.estado = EstadoServicio.Suspendido;
    }

    public void renaudar() {
        // luego de reanudarlo tiene que manualmente poner las inscripciones abiertas si es que quiere
        this.setActivo(true);
        this.estado = EstadoServicio.Privado;
    }

    // sacar de lombook
    public void setFechaFin(LocalDate fechaFinNueva) {
        // Validar que sea mayor que la actual
        LocalDate fechaActual = LocalDate.now();
        if (fechaFinNueva.isBefore(fechaActual)) {
            throw new UnsupportedOperationException("La fecha fin del servicio no puede ser anterior a la actual");
        }

        // Si la fecha fin era null entonces le dejamos configurarla
        if (this.fechaFin == null) {
            this.fechaFin = fechaFinNueva;
            // si hay inscripciones en curso les setteamos la fecha fin
            this.obtenerInscripcionesVigentes().stream().forEach(i -> {i.setFechaFin(fechaFinNueva);});
        } else {
            // Si el servicio ya inició, hay inscripciones y ya habia una fecha fin definida
            // Deberiamos validar que la diferencia entre la fecha fin anterior y la nueva
            // sea de unos dias no mucha diferencia
            if (this.yaInicio() && ! this.obtenerInscripcionesVigentes().isEmpty()) {
                // revisar que cantidad de dias sería razonable cambiar la fecha fin
                // acá tambien implementar que no de pueda cambiar la fecha fin si ya se cambió antes
                if ( ! this.esCambioFechaFinRazonable(fechaFinNueva, 15) ) {
                    throw new UnsupportedOperationException("La fecha fin nueva es muy alejada al que ya estaba configurada.");
                }
                this.fechaFin = fechaFinNueva;
            }
        }
    }

    public void finalizar() {
        // Setteamos la fecha fin
        if (fechaFin != null && fechaFin.isBefore(LocalDate.now())) {
            this.estado = EstadoServicio.Finalizado;
        }
    }

    public void cancelar() {
        // Setteamos la fecha fin a hoy y lo cancelamos
        this.setFechaFin(LocalDate.now());
        this.estado = EstadoServicio.Cancelado;
    }

    public void setFechaInicio(LocalDate fechaInicioNueva) {
        if (fechaInicioNueva != null && fechaInicioNueva.isBefore(LocalDate.now())) {
            throw new UnsupportedOperationException("La fecha inicio debe ser mayor a la actual");
        }
        this.fechaInicio = fechaInicioNueva;
    }

    public boolean esCambioFechaFinRazonable(LocalDate fechaFinNueva, long diasAceptados) {
        long diferenciaEnDiasDeFechasFin = ChronoUnit.DAYS.between(fechaFin, fechaFinNueva);
        // si la diferencia entre la fecha fin actual y la nueva que se quiere
        // es muy grande entonces el cambio no es razonable
        return (diferenciaEnDiasDeFechasFin <= diasAceptados);
    }

    public boolean tieneMontoInscripcion() {
        //Revisar si es asi
        return (montoInscripcion > 0);
    }


    public List<Alumno> obtenerAlumnosActuales() {
        return inscripciones.stream().filter(Inscripcion::estaVigente).map(Inscripcion::getAlumno).toList();
    }


    public List<Alumno> obtenerAlumnosPendientesAceptacion() {
        return this.obtenerInscripcionesPendientes().stream().map(Inscripcion::getAlumno).toList();
    }

    public List<Alumno> obtenerAlumnosActualesDeGrupo(Grupo grupo) {
        return inscripciones.stream()
                .filter(i -> i.estaVigente() && i.esDeEsteGrupo(grupo))
                .map(Inscripcion::getAlumno)
                .toList();
    }

//    public List<Cuota> obtenerUltimasCuotasAlumnosActuales() {
//        return inscripciones.stream()
//                .filter(Inscripcion::estaEnCurso)
//                .map(Inscripcion::obtenerUltimaCuota).toList();
//    }

    public List<Cuota> obtenerCuotasPendientesAlumnosActuales() {
        return inscripciones.stream()
                .filter(Inscripcion::estaEnCurso)
                .flatMap(inscripcion -> inscripcion.obtenerCuotasPendientes().stream())
                .toList();
    }

    public List<Cuota> obtenerCuotasAbonadasAlumnosActuales() {
        return inscripciones.stream()
                .filter(Inscripcion::estaEnCurso)
                .flatMap(inscripcion -> inscripcion.obtenerCuotasAbonadas().stream())
                .toList();
    }

    public List<Cuota> obtenerUltimasCuotasAlumnosActuales() {
        return inscripciones.stream()
                .filter(Inscripcion::estaEnCurso)
                .flatMap(inscripcion -> inscripcion.obtenerUltimasCuotas().stream())
                .toList();
    }

    public long calcularDuracionTotalEnDiasDeGrupo(Grupo grupo) {
        if (fechaFin == null) {
            throw new UnsupportedOperationException("Debe estar definida la fecha fin del servicio para calcular la duración");
        }
        return grupo.calcularDuracionTotalEnDias(fechaInicio, fechaFin);
    }

    public long calcularDuracionTotalEnDias() {
        if (fechaFin == null) {
            throw new UnsupportedOperationException("Debe estar definida la fecha fin del servicio para calcular la duración");
        }
        return ChronoUnit.DAYS.between(fechaInicio, fechaFin);
    }

    public boolean tienGrupoEnEsteHorario(LocalTime horaInicio,
                                          LocalTime horaFin, String nombreDiaSemana) {
        return this.grupos.stream().anyMatch(grupo -> grupo.tieneHorarioEn(horaInicio, horaFin, nombreDiaSemana));
    }

    public List<Double> calcularTotalPendienteYEsperado() {
        List<Cuota> cuotasPendientes = this.obtenerCuotasPendientesAlumnosActuales();
        List<Cuota> ultimasCuotas = this.obtenerUltimasCuotasAlumnosActuales();
        double totalPendiente = cuotasPendientes.stream()
                .mapToDouble(cuota -> cuota.getMontoServicio().getMonto()).sum();
        double totalEsperado = ultimasCuotas.stream()
                .mapToDouble(cuota -> cuota.getMontoServicio().getMonto()).sum();
        List<Double> totales = List.of(totalPendiente, totalEsperado);
        return totales;
    }

    public void agregarInscripcion(Inscripcion inscripcion) {
        this.inscripciones.add(inscripcion);
    }

//    public List<Inscripcion> obtenerInscripcionesEntre(LocalDate fechaInicio, LocalDate fechaFin) {
//        return this.inscripciones.stream().filter(i -> i.estaEntreEstasFechas(fechaInicio, fechaFin)).toList();
//    }

    public List<Inscripcion> obtenerInscripcionesEsteAnio(int anio) {
        return this.inscripciones.stream().filter(i -> i.esDeEsteAnio(anio)).toList();
    }

    public double[] calcularIngresosPorMes() {
        LocalDate fechaActual = LocalDate.now();
        int anioActual = fechaActual.getYear();

        double[] totalIngresosPorMes = new double[12];

        List<Cuota> cuotas = this.obtenerInscripcionesEsteAnio(anioActual)
                .stream().flatMap(i -> i.getCuotas().stream()) // Convertimos la lista de cuotas en un stream
                .toList();
        // LE sumamos el total del pago de la cuota al mes de la fecha del pago de la cuota
        for (Cuota cuota :cuotas) {
            Pago pago = cuota.getPago();
            int mes = pago.getFechaPago().getMonthValue();
            totalIngresosPorMes[mes] += cuota.getMontoServicio().getMonto();
        }
        return totalIngresosPorMes;
    }

    public  List<Clase> findClases(LocalDate fecha) {
        return this.grupos.stream().flatMap(g -> g.getClasesEn(fecha).stream()).toList();
    }

    public  List<Clase> findClases() {
        return this.grupos.stream().flatMap(g -> g.getClases().stream()).toList();
    }

    public List<List<Object>> findAlumnosConSusUltimasCuotas() {
        // tengo que en la primera lista agregar una lista que tenga Alumno cuota
        List<List<Object>> alumnosConSusCuotas = new ArrayList<>();
        List<Alumno> alumnosActuales =  this.obtenerAlumnosActuales();
        for (Alumno unAlumno : alumnosActuales) {
            List<Cuota> susCuotas = unAlumno.obtenerCuotasPendientesDeEsteServicio(this);
            List<Object> unAlumnoConSusCuotas = List.of(unAlumno, susCuotas);
            alumnosConSusCuotas.add(unAlumnoConSusCuotas);
        }
        return alumnosConSusCuotas;
    }

    public float getCalificacionPromedio() {
        if (this.resenias == null) {
            return 0;
        }
        if (this.resenias.isEmpty()) {
            return 0;
        }
        float cantidadResenias = this.resenias.size();
        float sumatoriaResenias = this.resenias.stream().mapToInt(Resenia::getCalificacion)  // Obtener la calificación de cada reseña
                .sum(); // Sumar todas las calificaciones
        float promedio = sumatoriaResenias / cantidadResenias;
        return promedio;
    }

    public void agregarResenia(Resenia resenia) {
        resenias.add(resenia);
    }

    public void quitarResenia(Resenia resenia) {
        resenias.remove(resenia);
    }

    public boolean tieneGrupoConEsteNombre(String nombreGrupo) {
        return this.grupos.stream().anyMatch(grupo -> grupo.getNombre().equals(nombreGrupo));
    }

    public boolean tieneEstaCategoria(String categoriaNombre) {
        return this.categoria.getNombre().equals(categoriaNombre);
    }


    public boolean incluyeEsteNombre(String nombre) {
        return this.nombre.contains(nombre);
    }

    public boolean incluyeEstaUbicacion(String ubicacion) {
        return this.ubicacion.contains(ubicacion);
    }

    public boolean tieneCalificacionMayorOIgualA(Float calificacionMinima) {
        return this.getCalificacionPromedio() >= calificacionMinima;
    }

    public List<Integer> calcularFrecuenciasSemanales() {
        return this.grupos.stream().map(Grupo::calcularVecesSemanales).toList();
    }

    public Double obtenerPrecioMinimo() {
        Stream<Double> montosActualesGrupos = this.grupos.stream().map(Grupo::obtenerMontoActual).map(MontoServicio::getMonto);
        return montosActualesGrupos.min(Double::compare).orElse(0.0);
    }

    public boolean tienePrecioIgualOMenorA(Double precioMaximo) {
        Double precioMinimoActual = this.obtenerPrecioMinimo();
        return precioMinimoActual <= precioMaximo;
    }

    public boolean tieneEstaFrecuenciaPago(Integer cantCiclo, ChronoUnit unidadCiclo) {
        if (this.tipoFrecuenciaPago == null || this.tipoFrecuenciaPago.getCantCiclo() == null || this.tipoFrecuenciaPago.getUnidadCiclo() == null ) {
            return false;
        }
        return this.tipoFrecuenciaPago.getCantCiclo().equals(cantCiclo) && this.tipoFrecuenciaPago.getUnidadCiclo().equals(unidadCiclo);
    }

    public boolean tieneGruposEnEstosDias(List<DayOfWeek> diasSemana) {
        // Devuelve true si alguno de sus grupos cumple con tener todos sus horarios en esos dias
        return this.grupos.stream().anyMatch(grupo -> grupo.tieneHorariosEnTodosEstosDias(diasSemana));
    }

    public boolean tieneGruposEnEstosTurnos(List<Turno> turnos) {
        return this.grupos.stream().anyMatch(grupo -> grupo.esDeAlgunoDeEstosTurnos(turnos));
    }
}