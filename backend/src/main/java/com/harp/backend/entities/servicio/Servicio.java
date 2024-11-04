package com.harp.backend.entities.servicio;

//import com.harp.backend.entities.grupo.Grupo;
//import com.harp.backend.entities.historialMontoCuota.HistorialMonto;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPago;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.modalidad.Modalidad;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "servicios")
// id	instructor_id	nombre	descripcion	costo?	frecuencia?
// capacidad_max_alumnos	capacidad_max_grupos	fecha_inicio
// fecha_fin	duracion_inscripcion	categoria_id
// cant_dias_ciclo	dia_limite_pago	tipo_frecuencia_pago_id
// faltan: activo, public, logo,
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @ManyToOne
//    @JoinColumn(name = "instructor_id", referencedColumnName = "id", nullable = false)
//    private Instructor instructor;

    private String nombre;
    private String descripcion;
    private String logoURL;

    //Revisar valor por defecto null o cero
    @Column(name = "capacidad_max_alumnos")
    private Integer cantMaxAlumnos;
    @Column(name = "capacidad_max_grupos")
    private int cantMaxGrupos;

    @Column(name = "fecha_inicio")
    private LocalDate fechaCreacion = LocalDate.now(); //No puede modificarse

    // Si un alumno se inscribe el 10/05 y duracion es 5meses, entonces finaliza el 10/10
    // Cuando se cree una inscripcion tendrá fecha fin = fecha actual + servicio.duracionTotalMeses
    @Column(name = "duracion_inscripcion")
    private int duracionTotalMeses;

    //Sin importar cuando el alumno se inscriba el servicio termina esta fecha
    // Cuando se cree una inscripcion tendrá esta fecha fin programada
    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    private boolean activo; //activo = que se esta cobrando
    private boolean publico; //publico = que se publicita

    @ManyToOne
    @JoinColumn(name = "categoria_id", referencedColumnName = "id")
    private Categoria categoria;

    @Column(name = "cant_dias_ciclo")
    private int cantDiasCiclo;

    //Cuando se creen las cuotas tendrán como fecha limite esta fecha
    @Column(name = "dia_limite_pago")
    private int diaLimitePago;

    @OneToMany
    @JoinColumn(name = "servicio_id")
    private Set<MontoServicio> historialMontos = new HashSet<>();

    // Servicio tiene una frecuencia de pago o varias?
    // Se usa al crear las cuotas, si el servicio cambia cada cuanto cobra las cuotas
    // entonces las proximas cuotas a cobrar se cobraran asi
    // yo creo cuotas antes de que se finalice la anterior y esas cuotas quizas quedan con otra frecuencia de pago
    // deberia crear las cuotas cuando se finaliza la anterior
    @ManyToOne
    @JoinColumn(name = "tipo_frecuencia_pago_id")
    private TipoFrecuenciaPago tipoFrecuenciaPago;

    //Eliminar frecuencia de la BD

    @Enumerated(EnumType.STRING)
    private Modalidad modalidad;

    @OneToMany
    @JoinColumn(name = "grupo_id")
    private Set<Grupo> grupos = new HashSet<>();

    @Column(name = "clase_prueba")
    private boolean claseDePrueba;

    //private String codigoInscripcion;

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

    public boolean tieneCuposLibres(int cantInscripcionesDeServicio) {
        // Si la cantMaxAlumnos es null, quiere decir que no hay un máximo de alumnos, siempre hay cupos
        // Si cantMaxAlumnos es mayor a la cantidad de inscripciones actual entonces hay cupos

        return (this.cantMaxAlumnos == null || this.cantMaxAlumnos > cantInscripcionesDeServicio);
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

    public boolean esDeModalidadPaseLibre() {
        return (modalidad == Modalidad.PaseLibre);
    }

    public boolean esDeModalidadGruposConHorariosFijos() {
        return (modalidad == Modalidad.GruposConHorariosFijos);
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


}