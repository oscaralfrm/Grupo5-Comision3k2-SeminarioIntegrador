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

import java.time.*;
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

    public List<Inscripcion> obtenerInscripcionesFinalizadas(){
        return inscripciones.stream().filter(i -> i.estaFinalizada() ).toList();
    }

    public List<Inscripcion> obtenerInscripcionesFinalizadas(Grupo grupo){
        return inscripciones.stream().filter(i -> i.estaFinalizada()  && i.esDeEsteGrupo(grupo) ).toList();
    }

    public List<Inscripcion> obtenerInscripcionesOrdenadas() {
        // Las primeras son las mas nuevas
        return this.inscripciones.stream().sorted(Comparator.comparing(Inscripcion::getFechaSolicitud).reversed()).toList();
    }

    public List<Inscripcion> obtenerUltimasInscripcionesNoPendientes(int cant) {
        return this.obtenerInscripcionesOrdenadas()
                .stream()
                .filter(inscripcion -> ! inscripcion.estaPendiente()).limit(cant).toList();
    }

    public List<Inscripcion> obtenerInscripcionesRecientementeFinalizadas() {
        return this.obtenerInscripcionesFinalizadas().stream().filter(inscripcion -> inscripcion.esRecientementeFinalizada()).toList();
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

    public boolean esVigente() {
        // es borrador si publico es false
        return (this.publico && this.activo);
    }


    public boolean yaFinalizo() {
        if (this.fechaFin == null) {
            return false;
        };
        return this.fechaFin.isEqual(LocalDate.now()) || this.fechaFin.isBefore(LocalDate.now());
    }

    public void hacerPublico() {
        if (this.yaFinalizo()) {
            throw new UnsupportedOperationException("El servicio ya finalizó por lo que no se pueden habilitar inscripciones.");
        }
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
        if (this.fechaFin != null) {
            return false;
        }
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

    public boolean sePuedenAbrirInscripciones() {
        // NO consideramos abrir inscripciones cuando se publica por primera vez por eso debe ya estar en publico
        System.out.println("inscripciones abiertas" + this.inscripcionesAbiertas);
        System.out.println("is publico" + this.isPublico());
        if ( ! this.inscripcionesAbiertas && this.isPublico() && ! this.esSuspendido()) {
            return true;
        }
        return false;
    }

    public boolean sePuedenCerrarInscripciones() {
        if ( this.inscripcionesAbiertas && this.isPublico() && ! this.esSuspendido()) {
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
            this.inscripcionesAbiertas = false;
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
                .filter(Inscripcion::estaVigente)
                .flatMap(inscripcion -> inscripcion.obtenerCuotasAbonadas().stream())
                .toList();
    }

    public List<Cuota> obtenerUltimasCuotasAlumnosActuales() {
        return inscripciones.stream()
                .filter(Inscripcion::estaEnCurso)
                .flatMap(inscripcion -> inscripcion.obtenerUltimasCuotas().stream())
                .toList();
    }

    public List<Cuota>  obtenerUltimasCuotasDeInscripcionesRecientementeFinalizadas() {
        return inscripciones.stream()
                .filter(Inscripcion::esRecientementeFinalizada)
                .flatMap(inscripcion -> inscripcion.obtenerUltimasCuotasAnuladas().stream())
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

    public List<Double> calcularIngresosRecibidoYEsperado(Month month, Year year) {
        LocalDate fechaVigencia = this.obtenerFechaVigenciaEstadisticas(null, month, year);
        List<Inscripcion> inscripciones = this.obtenerInscripcionesVigentesEn(fechaVigencia);

        double totalCuotasAbonadas = 0.0;
        double totalCuotas = 0.0;
        for (Inscripcion inscripcion : inscripciones) {
            // Filtramos las cuotas anuladas porque no se van a cobrar
            List<Cuota> cuotas = inscripcion.obtenerCuotasConCicloEn(month, year)
                    .stream().filter(cuota -> ! cuota.esAnulada()).toList();

            // Sumamos al total el total de las cuotas incluyendo recargos o descuentos
            totalCuotasAbonadas += cuotas.stream().filter(Cuota::esAbonada).mapToDouble(Cuota::calcularTotal).sum();
            totalCuotas += cuotas.stream().mapToDouble(Cuota::calcularTotal).sum();
        }

//        List<Cuota> cuotasPendientes = this.obtenerCuotasPendientesAlumnosActuales();
//        List<Cuota> ultimasCuotas = this.obtenerUltimasCuotasAlumnosActuales();
        List<Double> totales = List.of(totalCuotasAbonadas, totalCuotas);
        return totales;
    }

    public void agregarInscripcion(Inscripcion inscripcion) {
        this.inscripciones.add(inscripcion);
    }

//    public List<Inscripcion> obtenerInscripcionesEntre(LocalDate fechaInicio, LocalDate fechaFin) {
//        return this.inscripciones.stream().filter(i -> i.estaEntreEstasFechas(fechaInicio, fechaFin)).toList();
//    }

    public List<Inscripcion> obtenerInscripcionesVigentesEsteAnio(int anio) {
        return this.obtenerInscripcionesVigentes().stream().filter(i -> i.esDeEsteAnio(anio)).toList();
    }

    public double[] calcularIngresosPorMes(Year year) {
        double[] totalIngresosPorMes = new double[12];

        List<Cuota> cuotas = this.obtenerInscripcionesVigentesEsteAnio(year.getValue())
                .stream().flatMap(i -> i.obtenerCuotasAbonadas().stream()) // Convertimos la lista de cuotas en un stream
                .toList();
        // LE sumamos el total del pago de la cuota al mes de la fecha del pago de la cuota
        for (Cuota cuota :cuotas) {
            Pago pago = cuota.getPago();
            int mes = pago.getFechaPago().getMonthValue();
            totalIngresosPorMes[mes-1] += cuota.calcularTotal();
        }
        return totalIngresosPorMes;
    }

    public  List<Clase> findClases(LocalDate fecha) {
        return this.grupos.stream().flatMap(g -> g.getClasesEn(fecha).stream()).toList();
    }

    public  List<Clase> findClases() {
        return this.grupos.stream().flatMap(g -> g.getClases().stream()).toList();
    }

    public List<List<Object>> findInscripcionesConSusUltimasCuotas() {
        // tengo que en la primera lista agregar una lista que tenga Alumno cuota
        List<List<Object>> alumnosConSusCuotas = new ArrayList<>();
        List<Inscripcion> inscripcionesActuales =  this.obtenerInscripcionesVigentes();
        for (Inscripcion unaInscrip : inscripcionesActuales) {
            List<Cuota> susCuotas = unaInscrip.obtenerCuotasPendientes();
            List<Object> unaInscripcionConSusCuotas = List.of(unaInscrip, susCuotas);
            alumnosConSusCuotas.add(unaInscripcionConSusCuotas);
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

    public boolean tieneLogo() {
        return this.logoURL != null && ! this.logoURL.isEmpty();
    }

    public List<Inscripcion> obtenerInscripcionesVigentesEn(LocalDate fechaVigencia) {
        return this.inscripciones.stream().filter(inscripcion -> inscripcion.esVigenteEn(fechaVigencia)).toList();
    }

    public  List<Inscripcion> obtenerInscripcionesSolicitadasEn(Integer day, Month month, Year year) {
        return this.inscripciones.stream().filter(inscripcion -> inscripcion.esSolicitadaEn(day, month, year)).toList();
    }

    public  List<Inscripcion> obtenerInscripcionesDeGrupoSolicitadasEn(Grupo grupo, Integer day, Month month, Year year) {
        return this.inscripciones.stream().filter(inscripcion -> inscripcion.esDeEsteGrupo(grupo) && inscripcion.esSolicitadaEn(day, month, year)).toList();
    }

    public List<Inscripcion> obtenerInscripcionesDeGrupoVigentesEn(Grupo grupo, LocalDate fechaVigencia) {
        return inscripciones.stream()
                .filter(i -> i.esVigenteEn(fechaVigencia) && i.esDeEsteGrupo(grupo))
                .toList();
    }

    public int calcularCantidadAlumnos(Month month, Year year) {
        // Obtenemos las inscripciones vigentes al final del mes de ese año

        LocalDate fechaVigencia;
        // Obtenemos el numero del ultimo dia de ese mes y año
        if (month != null && year != null) {
            fechaVigencia = YearMonth.of(year.getValue(), month).atEndOfMonth();
        } else if (month == null && year != null) {
            if (LocalDate.now().getYear() == year.getValue()) {
                fechaVigencia = LocalDate.now();
            } else {
                Month diciembre = Month.DECEMBER;
                fechaVigencia = YearMonth.of(year.getValue(), diciembre).atEndOfMonth();
            }
        } else if (month != null && year == null) {
            fechaVigencia = YearMonth.of(LocalDate.now().getYear(), month).atEndOfMonth();
        } else {
            return 0;
        }

        List<Inscripcion> inscripciones = this.obtenerInscripcionesVigentesEn(fechaVigencia);
        return inscripciones.size();
    }

    public int calcularCantidadAlumnosDeGrupoEn(Grupo grupo, Integer day, Month month, Year year) {
        LocalDate fechaVigencia;
        if (day != null && month != null && year != null) {
            fechaVigencia = LocalDate.of(year.getValue(), month, day);
        } else {
            // Si el año y el mes son iguales a los de la fecha actual entonces
            // Obtenemos las inscripciones vigentes hoy
            LocalDate fechaActual = LocalDate.now();
            if (fechaActual.getMonth().equals(month) && fechaActual.getYear() == year.getValue()) {
                fechaVigencia = fechaActual;
            } else {
                // Si el año y mes son anteriores al de la fecha actual entonces
                // Obtenemos las inscripciones vigentes al final del mes de ese año
                // Obtenemos el numero del ultimo dia de ese mes y año
                fechaVigencia = YearMonth.of(year.getValue(), month).atEndOfMonth();
            }
        }

        List<Inscripcion> inscripcionesDeGrupo = this.obtenerInscripcionesVigentesEn(fechaVigencia)
                .stream().filter(inscripcion -> inscripcion.esDeEsteGrupo(grupo)).toList();
        return inscripcionesDeGrupo.size();
    }


    public double calcularPrecioPromedioDeGrupos(Integer day, Month month, Year year) {
        if (grupos.isEmpty()) return 0.0;

        LocalDate fecha;
        if (day != null) {
            fecha = LocalDate.of(year.getValue(), month, day);
        } else {
            // Si el año y el mes son iguales a los de la fecha actual entonces
            // Obtenemos los precios de hoy
            LocalDate fechaActual = LocalDate.now();
            if (fechaActual.getMonth().equals(month) && fechaActual.getYear() == year.getValue()) {
                fecha = fechaActual;
            } else {
                // Si el año y mes son anteriores al de la fecha actual entonces
                // Obtenemos los precios al final del mes de ese año
                // Obtenemos el numero del ultimo dia de ese mes y año
                fecha = YearMonth.of(year.getValue(), month).atEndOfMonth();
            }
        }

        double acumPrecios = this.grupos.stream().mapToDouble(grupo -> {
            MontoServicio monto = grupo.obtenerMontoEn(fecha);
            return (monto != null) ? monto.getMonto() : 0.0; // Manejo de monto nulo
        }).sum();

        double promedioPrecios = acumPrecios / (double) grupos.size();
        return promedioPrecios;
    }

    public double[] calcularPreciosPromedioDeGruposPorMes(Year year) {
        double[] preciosPromedioGruposPorMes = new double[12];

        if (grupos.isEmpty()) return preciosPromedioGruposPorMes;

        // Si el año es el actual entonces recorremos hasta el numero del mes actual
        // Sino recorremos los 12 meses
        int cantMeses;
        if (year.getValue() == LocalDate.now().getYear()) {
            cantMeses = LocalDate.now().getMonthValue();
        } else {
            cantMeses = 12;
        }

        // *Se podria agregar un atributo a los grupos de fechaCreacion y verificar que existían

        // Calculamos el precio promedio por cada mes correspondiente y lo agregamos a la lista
        for (int i = 1; i <= cantMeses; i++) {
            // Empezamos a recorrer la lista en 1 para que coincida con el num del mes
            // Por eso recorremos hasta incluir el ultimo mes de cantMeses
            // Pasamos el dia en null y la funcion se encarga de ponerle el dia correspondiente
            preciosPromedioGruposPorMes[i-1] += this.calcularPrecioPromedioDeGrupos(null, Month.of(i), year);
        }
        return preciosPromedioGruposPorMes;
    }

    public LocalDate obtenerFechaVigenciaEstadisticas(Integer day, Month month, Year year) {
        LocalDate fechaVigencia;
        if (day != null) {
            fechaVigencia = LocalDate.of(year.getValue(), month, day);
        } else {
            // Si el año y el mes son iguales a los de la fecha actual entonces
            // Obtenemos las inscripciones vigentes hoy
            LocalDate fechaActual = LocalDate.now();
            if (fechaActual.getMonth().equals(month) && fechaActual.getYear() == year.getValue()) {
                fechaVigencia = fechaActual;
            } else {
                // Si el año y mes son anteriores al de la fecha actual entonces
                // Obtenemos las inscripciones vigentes al final del mes de ese año
                // Obtenemos el numero del ultimo dia de ese mes y año
                fechaVigencia = YearMonth.of(year.getValue(), month).atEndOfMonth();
            }
        }
        return fechaVigencia;
    }

    public double calcularDemoraPromedioDeAlumnosDeGrupoEnAbonar(Grupo grupo, Month month, Year year) {
        // Obtenemos las inscripciones del grupo vigentes en esa fecha
        // Calculamos la demora promedio de pagos obteniendo solo las cuotas de ese mes o año
        // Si es el mes y año actual el dia es el dia de hoy
        // Si no lo es, es el ultimo dia del mes
        LocalDate fechaVigencia = this.obtenerFechaVigenciaEstadisticas(null, month, year);
        List<Inscripcion> inscripcionesDeGrupo = this.obtenerInscripcionesDeGrupoVigentesEn(grupo, fechaVigencia);

        if (inscripcionesDeGrupo.isEmpty()) return 0.0;

        double acumDemoraPromedioAlumnos = 0.0;
        for (Inscripcion inscripcion : inscripcionesDeGrupo) {
            // Calculamos la demora promedio de pagos de la inscripcion
            // obteniendo solo las cuotas que están en ese mes y año
            double demoraPromedio = inscripcion.calcularDemoraPromedioPagosEn(month, year);
            acumDemoraPromedioAlumnos += demoraPromedio;
        }

        double promedioDemoras = acumDemoraPromedioAlumnos / (double) inscripcionesDeGrupo.size();
        return promedioDemoras;
    }

    public double calcularDemoraPromedioDeAlumnosEnAbonar(Month month, Year year) {
        double acumDemoraPromedioAlumnos = 0.0;

        if (grupos.isEmpty()) return 0.0;

        for (Grupo grupo : grupos) {
            double demoraPromedio = this.calcularDemoraPromedioDeAlumnosDeGrupoEnAbonar(grupo, month, year);
            acumDemoraPromedioAlumnos += demoraPromedio;
        }

        double promedioDemoras = acumDemoraPromedioAlumnos / (double) grupos.size();
        return promedioDemoras;
    }

    public double calcularPorcentajePromedioDeVencimientosDeGrupo(Grupo grupo, Month month, Year year) {
        // Obtenemos las inscripciones del grupo vigentes en esa fecha
        // Calculamos el porcentaje de vencimientos obteniendo solo las cuotas de ese mes o año
        // Si es el mes y año actual el dia es el dia de hoy
        // Si no lo es, es el ultimo dia del mes
        LocalDate fechaVigencia = this.obtenerFechaVigenciaEstadisticas(null, month, year);
        List<Inscripcion> inscripcionesDeGrupo = this.obtenerInscripcionesDeGrupoVigentesEn(grupo, fechaVigencia);

        if (inscripcionesDeGrupo.isEmpty()) return 0.0;

        double acumPorcentajesVencimientosAlumnos = 0.0;
        for (Inscripcion inscripcion : inscripcionesDeGrupo) {
            // Calculamos la demora promedio de pagos de la inscripcion
            // obteniendo solo las cuotas que están en ese mes y año
            double porcentajeVencimientos = inscripcion.calcularPorcentajeVencimientosEn(month, year);
            acumPorcentajesVencimientosAlumnos += porcentajeVencimientos;
        }

        double promedioVencimientos = acumPorcentajesVencimientosAlumnos / (double) inscripcionesDeGrupo.size();
        return promedioVencimientos;
    }

    public double calcularPorcentajePromedioDeVencimientos(Month month, Year year) {
        double acumPorcentajeVencimientosPormedio = 0.0;

        if (grupos.isEmpty()) return 0.0;

        for (Grupo grupo : grupos) {
            double porcentajeVencimientosPromedio = this.calcularPorcentajePromedioDeVencimientosDeGrupo(grupo, month, year);
            acumPorcentajeVencimientosPormedio += porcentajeVencimientosPromedio;
        }

        double promedioPorcentajesVencimientos = acumPorcentajeVencimientosPormedio / (double) grupos.size();
        return promedioPorcentajesVencimientos;
    }

    public int contarSolicitudesInscripcionDeGrupoEn(Grupo grupo, Integer day, Month month, Year year) {
        List<Inscripcion> solicitudesInscripcion = this.obtenerInscripcionesDeGrupoSolicitadasEn(grupo, day, month, year);
        return solicitudesInscripcion.size();
    }

    public int contarSolicitudesInscripcionEn(Integer day, Month month, Year year) {
        List<Inscripcion> solicitudesInscripcion = this.obtenerInscripcionesSolicitadasEn(day, month, year);
        return solicitudesInscripcion.size();
    }

    public double calcularPorcentajeSolicitudesAceptadasDeGrupo(Grupo grupo, Integer day, Month month, Year year) {
        List<Inscripcion> solicitudesInscripcion = this.obtenerInscripcionesDeGrupoSolicitadasEn(grupo, day, month, year);
        List<Inscripcion> aceptadas = solicitudesInscripcion.stream().filter(inscripcion -> inscripcion.getFechaAceptacion() != null).toList();

        int cantSolicitudes = solicitudesInscripcion.size(); // 100%
        int cantAceptadas = aceptadas.size();  // ?%

        if (cantSolicitudes == 0) return 0.0;

        double porcentajeAceptadas = (double) cantAceptadas * 100.0 / cantSolicitudes;
        return porcentajeAceptadas;
    }

    public double calcularPorcentajeSolicitudesAceptadas(Integer day, Month month, Year year) {
        List<Inscripcion> solicitudesInscripcion = this.obtenerInscripcionesSolicitadasEn(day, month, year);
        List<Inscripcion> aceptadas = solicitudesInscripcion.stream().filter(inscripcion -> inscripcion.getFechaAceptacion() != null).toList();

        int cantSolicitudes = solicitudesInscripcion.size(); // 100%
        int cantAceptadas = aceptadas.size();  // ?%

        if (cantSolicitudes == 0) return 0.0;

        double porcentajeAceptadas = (double) cantAceptadas * 100.0 / cantSolicitudes;
        return porcentajeAceptadas;
    }

    public double calcularTiempoPromedioRespuestaSolicitudesEnDias(Integer day, Month month, Year year) {
        // Filtramos las pendientes porque no tienen fecha ni de aceptacion ni de rechazo
        List<Inscripcion> solicitudesInscripcion = this.obtenerInscripcionesSolicitadasEn(day, month, year)
                .stream()
                .filter(inscripcion -> ! inscripcion.estaPendiente()).toList();

        int cantSolicitudes = solicitudesInscripcion.size();
        if (cantSolicitudes == 0) return 0.0;

        double acumDiferenciasEnDias = 0.0;
        for (Inscripcion solicitud : solicitudesInscripcion) {
            LocalDate fechaRespuesta = solicitud.getFechaAceptacion() != null ? solicitud.getFechaAceptacion() : solicitud.getFechaRechazo();
            if (fechaRespuesta != null) {
                double diferencia = ChronoUnit.DAYS.between(solicitud.getFechaSolicitud(), fechaRespuesta);
                acumDiferenciasEnDias += diferencia;
            }
        }

        double promedioTiempo = acumDiferenciasEnDias / (double) cantSolicitudes;
        return promedioTiempo;
    }

//    public MontoServicio encontrarMejorPrecioDeGrupoSegunCantidadInscripcionesSolicitadasYVigentes(Grupo grupo) {
//        // Por cada uno de sus montos calculamos el mejor
//        // Y vemos cuantas inscripciones se solicitaron entre las fechas de vigencia del monto
//
//        MontoServicio mejorPrecio
//        for (MontoServicio monto : grupo.getHistorialMontos()) {
//            LocalDate fechaInicioMonto = monto.getFechaInicio();
//            LocalDate fechaFinMonto = monto.getFechaFin();
//
//
//            int cantInscripcionesVigentes = this.obtenerInscripcionesDeGrupoVigentesEn(grupo, fechaFinMonto).size();
//            // le deberiamos sumar la cantidad de solicitudes de inscripcion rechazadas o todavia no aceptadas
//
//
//
//        }
//    }

    public double calcularPrecioPromedioPorHora(LocalDate fecha) {
        return this.grupos.stream().mapToDouble(grupo -> grupo.calcularPrecioPorHora(fecha, this.tipoFrecuenciaPago)).average().orElse(0.0);
    }
}