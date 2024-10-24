package com.harp.backend.entities.grupo;

import com.harp.backend.entities.alumno.model.Alumno;
//import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.Horario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
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
    private int cantMaxCupos;

    @OneToMany
    @JoinColumn(name = "grupo_id")
    private Set<Horario> horarios = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "alumnosxgrupos", // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "grupo_id"), // FK hacia la tabla Grupo
            inverseJoinColumns = @JoinColumn(name = "alumno_id") // FK hacia la tabla Alumno
    )
    private Set<Alumno> alumnos = new HashSet<>();

    public void agregarAlumno(Alumno alumno) {
        alumnos.add(alumno);
    }

    public void agregarHorario(Horario horario) {
        horarios.add(horario);
    }
}
