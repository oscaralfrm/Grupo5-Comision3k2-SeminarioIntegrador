package com.harp.backend.entities.inscripcion;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.cuota.CuotaService;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.pagos.Pago;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor

@Entity
@Table(name = "inscripciones")
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "alumno_id", nullable = false)
    //@JsonIgnore
    private Alumno alumno;

    //AGREGAR EN LA BASE DE DATOS
    @Column(name = "fecha_solicitud")
    private LocalDate fechaSolicitud = LocalDate.now();

    // agregar en la base de datos
    @Column(name = "fecha_aceptacion")
    private LocalDate fechaAceptacion;

    @Setter(AccessLevel.NONE) // SOlo se puede modificar con el método aceptar()
    @Column(name = "fecha_inscripcion")
    private LocalDate fechaInicio;

    //AGREGAR EN LA BASE DE DATOS
    @Setter(AccessLevel.NONE)
    @Column(name = "fecha_fin_inscripcion")
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(name = "nombre_estado")
    private EstadoInscripcion estado = EstadoInscripcion.PendienteAceptacion; //PendienteAceptacion Aceptada Rechazada Finalizada

    @Column(name = "cant_veces_semanales")
    private Integer cantVecesSemanales;

    @ManyToOne
    @JoinColumn(name = "servicio_id")
    private Servicio servicio;

    @ManyToOne
    @JoinColumn(name = "grupo_id")
    private Grupo grupo;

    private String motivoRechazo;

    //HACERLO EN LA BASE DE DATOS CON TABLA INTERMEDIA
    //HAcerlo LAZY
    @ManyToMany
    @JoinTable(
            name = "horariosxinscripcion", // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "inscripcion_id"), // FK hacia la tabla Inscripcion
            inverseJoinColumns = @JoinColumn(name = "horario_id") // FK hacia la tabla Horario
    )
    @JsonIgnore
    private List<Horario> horarios;

    @OneToMany
    @JoinColumn(name = "inscripcion_id")
    @JsonIgnore
    private List<Cuota> cuotas = new ArrayList<>();

    public Inscripcion(Servicio servicio, Grupo grupo, List<Horario> horarios, Alumno alumno) {
        this.servicio = servicio;
        this.grupo = grupo;
        this.horarios = horarios;
        this.cantVecesSemanales = horarios.size();
        this.alumno = alumno;
    }

    public Inscripcion(Servicio servicio, Grupo grupo, Alumno alumno) {
        this.servicio = servicio;
        this.grupo = grupo;
        // definimos la cantidad de veces semanales como la cantidad de horarios que tiene el grupo
        this.cantVecesSemanales = grupo.getHorarios().size();
        this.alumno = alumno;
    }

    public Inscripcion(Servicio servicio, Alumno alumno) {
        this.servicio = servicio;
        this.alumno = alumno;
    }

    public void agregarCuota(Cuota cuota) {
        cuotas.add(cuota);
    }

    public boolean tieneEstaCuota (Cuota cuotaExistente) {
        return cuotas.contains(cuotaExistente);
    }

    public Cuota obtenerUltimaCuota() {
        // siempre hay una sola cuota que cumple con ser la ultima
        // pero no le podemos preguntar a la cuota si es la ultima porque debemos compararlas entre fechas
        return Collections.max(cuotas, Comparator.comparing(Cuota::getFechaInicioCiclo));
    }

    // quiero la ultima si es abonada
    // la ultima si es pendiente
    // y si tiene del mes anterior que tambien me la traiga

    public List<Cuota> obtenerUltimasCuotas() {
        Cuota ultimaCuota = obtenerUltimaCuota();
        if (ultimaCuota.esAbonada()) {
            return List.of(ultimaCuota);
        } else {
            if (tieneEstaCantCuotasPendientes(2)) {
                return obtenerCuotasPendientes();
            } else {
                return List.of(ultimaCuota);
            }
        }
    }

    public boolean tieneEstaCantCuotasPendientes(int cant) {
        return obtenerCuotasPendientes().size() == cant;
    }

    public List<Cuota> obtenerCuotasPendientes() {
        return cuotas.stream().filter(Cuota::esPendiente).toList();
    }

    public List<Cuota> obtenerCuotasVencidas() {
        return cuotas.stream().filter(Cuota::esVencida).toList();
    }

    public void iniciar() {
        // se puede iniciar si esta en pendiente o en aceptada
        // si un alumno se inscribe pagando se acepta solo
        if ( ! estaAceptada() ) {
            throw new UnsupportedOperationException("La inscripcion no puede iniciarse porque nunca fue aceptada");
        }
        LocalDate fechaActual = LocalDate.now();

        // no setteamos la fecha inicio = actual porque
        // al aceptar la inscrip ya la definimos de antemano, revisar cuando el alumno se inscriba al pagar el solo
        //this.fechaInicio = fechaActual;
        this.estado = EstadoInscripcion.EnCurso;
    }

    public void aceptar(LocalDate fechaInicioNueva, LocalDate fechaFin) {
        // La puedo aceptar solo cuando esta en pendiente
        if (! this.estaPendiente() ) {
            throw new UnsupportedOperationException("La inscripción no puede ser aceptada");
        }
        this.fechaAceptacion = LocalDate.now();

        //Revisar: si es modalidad duracion inicio-fin se debe settear la fechafin a servicio.getFechaFin()
        //pero si la modalidad es duracion desde fecha de inscripcion se debe settear la fecha fin = fechaInscricion + servicio.getDuracion()
        //pero si es modalidad duracion indefinida la fecha inscripcion no se settea, queda en null

        // Siempre vamos a tener fecha inicio, solo algunas veces fecha fin
        this.fechaInicio = fechaInicioNueva;
        this.fechaFin = fechaFin;

        //cambiar el estado a Aceptada
        this.estado = EstadoInscripcion.Aceptada;

        // En caso que la fecha inicio sea igual a la actual se inicia la inscripcion
        if (this.fechaInicio.isEqual(LocalDate.now())) {
            this.iniciar();
        }
    }

    public void rechazar(String motivo) {
        // la puedo rechazar solo cuando está en Pendiente
        if (fechaAceptacion != null) {
            throw new UnsupportedOperationException("La inscripción ya fue previamente aceptada");
        }
        if (! this.estaPendiente()) {
            throw new UnsupportedOperationException("La inscripción ya no se puede rechazar");
        }
        //cambiar el estado a Rechazada
        this.estado = EstadoInscripcion.Rechazada;

        // REVISAR si aca deberiamos cambiar la fechaFinInscripcion o no

        this.motivoRechazo = motivo;
    }

    public boolean esFinalizada() {
        return (this.estado == EstadoInscripcion.Finalizada);
    }

    // Implementar según tipo de duración del servicio
    // esto se llamará luego desde un proceso automático
    // si se utiliza manualmente para settear la fecha fin entonces tenemos que validar:
    // por ejemplo si el servicio decide cambiar su fecha de finalizacion
    // se tienen que modificar todas la fecha fin de todas sus inscripciones
    // puede que estas inscripciones hayan tenido o no una fecha fin definida
    public void finalizar() {
        // si no esta en aceptada entonces esta en pendiente y no puede finalizarse, sino rechazarse
        // si no esta en en curso o aceptada no puede finalizarce
        // si no esta vigente por que ya finalizó, entonces tampoco puede finalizarse
        if (! this.estaVigente()) {
            throw new UnsupportedOperationException("La inscripcion no puede finalizarce");
        }
        // si se creó con una fecha fin especifica, no puede finalizarse antes
        // pero si hoy es dia de vencerse, su fechaFin no es null pero esta fechaFin es igual a la actual entonces si puede finalizarce
        if (fechaFin != null && fechaFin.isAfter(LocalDate.now())) {
            throw new UnsupportedOperationException("La inscripción fue programada previamente para finalizarce en una fecha futura.");
        }
        this.fechaFin = LocalDate.now();
        //cambiar el estado a Finalizada
        this.estado = EstadoInscripcion.Finalizada;
    }

    public void setFechaFin(LocalDate fechaFinNueva) {
        LocalDate fechaActual = LocalDate.now();
        if (fechaFinNueva.isBefore(fechaActual)) {
            throw new UnsupportedOperationException("La fecha fin debe ser mayor a la actual");
        }
        if (this.fechaFin != null && this.fechaFin.isAfter(LocalDate.now()) ) {
            // revisar si esto es correcto aca o no
            throw new UnsupportedOperationException("La inscripción fue programada previamente para finalizarce en una fecha futura.");
        }
        if (fechaFinNueva.isEqual(fechaActual)) {
            this.finalizar();
            // ver como hacer para que corte aca en este caso como un break
        }
        this.fechaFin = fechaFinNueva;
    }

    public Cuota obtenerCuotaConEsteId(Long idCuota) {
        return cuotas.stream()
                .filter(c -> c.tieneEsteId(idCuota))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementFoundException("No se encontró cuota para esa inscripcion"));
    }


    public boolean esDeEsteServicio(Servicio servicio) {
        return (servicio.tieneEsteGrupo(this.grupo));
    }

    public boolean esDeEsteGrupo(Grupo grupo) {
        return (this.grupo == grupo);
    }

    public boolean esDeEsteAlumno(Alumno alumno) {
        return (this.alumno == alumno);
    }

    // Vigente es tanto aceptada como en curso
    public boolean estaVigente() {
        return (estaAceptada() || estaEnCurso());
    }

    public boolean estaAceptada() {
        return (this.estado == EstadoInscripcion.Aceptada);
    }

    public boolean estaEnCurso() {
        return (this.estado == EstadoInscripcion.EnCurso);
    }

    public boolean estaPendiente() {
        return (this.estado == EstadoInscripcion.PendienteAceptacion);
    }

    public boolean esDeEsteAnio(int anio) {
        return ( this.fechaInicio.getYear() == anio );
    }

 }
