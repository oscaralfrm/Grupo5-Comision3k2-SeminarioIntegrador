package com.harp.backend.entities.servicio;

//import com.harp.backend.entities.grupo.Grupo;
//import com.harp.backend.entities.historialMontoCuota.HistorialMonto;
import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

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
    private int cantMaxAlumnos;
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

    //private List<FrecuenciaPago> FrecuenciaPago;


    @OneToMany
    @JoinColumn(name = "grupo_id")
    private Set<Grupo> grupos = new HashSet<>();


    //private boolean claseDePrueba;

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


}