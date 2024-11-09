package com.harp.backend.entities.servicio;

//import com.harp.backend.entities.grupo.Grupo;
//import com.harp.backend.entities.historialMontoCuota.HistorialMonto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPago;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.modalidad.Modalidad;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor

@Entity
@Table(name = "servicios")
public class Servicio {

    public Servicio(String nombre, String descripcion, String logoURL, String ubicacion,
                    Integer cantMaxAlumnosPorGrupo, int cantHorariosPorGrupo, int duracionTotalMeses,
                    LocalDate fechaInicio, LocalDate fechaFin,
                    boolean publico, int cantDiasCiclo, int diaLimitePago,
                    boolean claseDePrueba, boolean asistenciasActivas) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.logoURL = logoURL;
        this.ubicacion = ubicacion;
        this.cantMaxAlumnosPorGrupo = cantMaxAlumnosPorGrupo;
        //this.cantHorariosPorGrupo = cantHorariosPorGrupo;
        this.duracionTotalMeses = duracionTotalMeses;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.publico = publico;
        this.cantDiasCiclo = cantDiasCiclo;
        this.diaLimitePago = diaLimitePago;
        this.claseDePrueba = claseDePrueba;
        this.asistenciasActivas = asistenciasActivas;

        // Valores predeterminados o inicializados por defecto
        this.fechaCreacion = LocalDate.now(); // Fecha de creación en la fecha actual
        this.activo = false;                  // Por defecto, el servicio no está activo
        this.historialMontos = new HashSet<>(); // Inicializa el historial de montos vacío
        this.grupos = new HashSet<>();          // Inicializa los grupos vacíos
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;
    private String logoURL;
    private String ubicacion;

    //Revisar valor por defecto null o cero
    @Column(name = "cant_max_alumnos_por_grupo")
    private Integer cantMaxAlumnosPorGrupo;

    private Integer cantMaxAlumnos;
    @Column(name = "cant_veces_semanales")
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
    private boolean inscripcionesAbiertas; // cargar en base de datos

    @ManyToOne
    @JoinColumn(name = "categoria_id", referencedColumnName = "id")
    private Categoria categoria;

    // es != null si no es cada X cant dias
    @Column(name = "cant_dias_ciclo")
    private Integer cantDiasCiclo;

    //Cuando se creen las cuotas tendrán como fecha limite esta fecha
    @Column(name = "dia_limite_pago")
    private Integer diaLimitePago;

    @OneToMany
    @JoinColumn(name = "servicio_id")
    @JsonIgnore
    private Set<MontoServicio> historialMontos = new HashSet<>();

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

    @OneToMany
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

    private double montoInscripcion;


    public void desactivar() {
        this.setActivo(false);
    }

    public void hacerPrivado() {
        this.setPublico(false);
    }

    public void agregarGrupo(Grupo grupo) {
        this.grupos.add(grupo);
    }

    public void agregarMontoAHistorial(MontoServicio monto) {
        this.historialMontos.add(monto);
    }

    public MontoServicio buscarMontoActual() {
        for (MontoServicio monto : historialMontos) {
            if (monto.esMontoActual()) {
                return monto;
            }
        }
        throw new NoSuchElementFoundException("Monto actual no encontrado");
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

    public List<MontoServicio> obtenerMontosActuales() {
        return historialMontos.stream().filter(MontoServicio::esMontoActual).toList();
    }

    public MontoServicio obtenerMontoActualConEstasVecesSemanales(int vecesSemanales) {
        for (MontoServicio monto : this.obtenerMontosActuales()) {
            if (monto.esDeEstasVecesSemanales(vecesSemanales)) {
                return monto;
            }
        }
        throw new NoSuchElementFoundException("No se encontró un monto actual del servicio para esas veces semanales");
    }

    public boolean tieneMontoActualConfigurado() {
        return (! this.obtenerMontosActuales().isEmpty());
    }

    public boolean tieneMontoActualConEstasVecesSemanales(Integer cantVecesSemanales) {
        if (! tieneMontoActualConfigurado()) {
            return false;
        }
        return historialMontos.stream().anyMatch(m -> m.esDeEstasVecesSemanales(cantVecesSemanales) );
    }

    public boolean tieneMontoProgramadoFuturo() {
        return historialMontos.stream().anyMatch(MontoServicio::esMontoProgramadoFuturo);
    }

//    public boolean tieneEstaCantVecesSemanales(int vecesSemanales) {
//        // implementar de otra forma si se le permite a los alumnos inscribirse
//        // a algunos horarios de un grupo en vez de a todos
//        return this.cantHorariosPorGrupo.equals(vecesSemanales);
//    }

    public List<Inscripcion> obtenerInscripcionesVigentes() {
        return inscripciones.stream().filter(Inscripcion::estaVigente).toList();
    }

    public List<Inscripcion> obtenerInscripcionesVigentes(Grupo grupo){
        return inscripciones.stream().filter(i -> i.estaVigente() && i.esDeEsteGrupo(grupo) ).toList();
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
        return (fechaInicio.isBefore(LocalDate.now()));
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
            inscripciones.stream().forEach(i -> {i.setFechaFin(fechaFinNueva);});
        } else {
            // Si el servicio ya inició, hay inscripciones y ya habia una fecha fin definida
            // Deberiamos validar que la diferencia entre la fecha fin anterior y la nueva
            // sea de unos dias no mucha diferencia
            if (this.yaInicio() && ! this.obtenerInscripcionesVigentes().isEmpty()) {
                // revisar que cantidad de dias sería razonable cambiar la fecha fin
                // acá tambien implementar que no de pueda cambiar la fecha fin si ya se cambió antes
                this.esCambioFechaFinRazonable(fechaFinNueva, 15);
            }
        }
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
        return inscripciones.stream().filter(Inscripcion::estaEnCurso).map(Inscripcion::getAlumno).toList();
    }

    public List<Cuota> obtenerUltimasCuotasAlumnosActuales() {
        return inscripciones.stream()
                .filter(Inscripcion::estaEnCurso)
                .map(Inscripcion::obtenerUltimaCuota).toList();
    }



}