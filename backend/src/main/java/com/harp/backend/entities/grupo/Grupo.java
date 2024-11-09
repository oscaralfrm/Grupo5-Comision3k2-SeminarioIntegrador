package com.harp.backend.entities.grupo;

import com.harp.backend.entities.alumno.model.Alumno;
//import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.horario.Horario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "grupos")
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "numero")
    private Integer numero;
    //private String nombre;

    @Column(name = "cant_max_cupos")
    private Integer cantMaxAlumnos;

    @OneToMany
    @JoinColumn(name = "grupo_id")
    private Set<Horario> horarios = new HashSet<>();
/*
    @ManyToMany
    @JoinTable(
            name = "alumnosxgrupos", // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "grupo_id"), // FK hacia la tabla Grupo
            inverseJoinColumns = @JoinColumn(name = "alumno_id") // FK hacia la tabla Alumno
    )
    private Set<Alumno> alumnos = new HashSet<>();
*/

    @OneToMany
    @JoinColumn(name = "grupo_id")
    private Set<Clase> clases = new HashSet<>();

/*
    public void agregarAlumno(Alumno alumno) {
        // Revisar que el grupo tenga cupos
        if (! this.tieneCuposLibres()) {
            throw new UnsupportedOperationException("El grupo no tiene cupos libres");
        }
        alumnos.add(alumno);
    }

    public void eliminarAlumno(Alumno alumno) {
        alumnos.remove(alumno);
    }
*/
    public void agregarHorario(Horario horario) {
        horarios.add(horario);
    }

    public void agregarClase(Clase clase) { clases.add(clase); }

//    public boolean tieneAEsteAlumno(Alumno alumno) {
//        return alumnos.contains(alumno);
//    }

    public boolean tieneEsteNumero(Integer numero) {
        //Revisar si es == o equals
        return (Objects.equals(this.numero, numero));
    }

    public boolean tieneEsteId(Long id) {
        //Revisar si es == o equals
        return (Objects.equals(this.id, id));
    }

//    public boolean tieneCuposLibres() {
//        return (this.cantMaxCupos > this.alumnos.size());
//    }

    public List<Horario> obtenerHorariosConEstosIds(List<Long> idsHorarios) {
        // Obtenemos todos los ids de los horarios de este grupo
        List<Long> idsHorariosExistentes = this.horarios.stream().map(Horario::getId).toList();

        // Verificar si todos los IDs de la lista están presentes en los horarios
        for (Long id : idsHorarios) {
            if ( ! idsHorariosExistentes.contains(id) ) {
                throw new IllegalArgumentException("Este grupo no tiene ese horario");
            }
        }

        // Recorro los horarios existentes y retorno los que tienen ids de la lista pasada por parametros
        return this.horarios.stream()
                .filter(horario -> idsHorarios.contains( horario.getId() )).toList();
    }

    public Integer calcularVecesSemanales() {
        // si hay dos horarios el mismo dia en un grupo lo contamos como otra vez a la semana
        // aunque es el mismo dia
        return horarios.size();
    }

    public boolean tieneEstasVecesSemanales(Integer cantVecesSemanles) {
        return ( this.calcularVecesSemanales().equals(cantVecesSemanles));
    }

    public long calcularHorasSemanales() {
        long horasTotales = 0;
        for (Horario horario : horarios) {
            horasTotales += horario.calcularDuracionEnHoras();
        }
        return horasTotales;
    }
}
