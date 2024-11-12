package com.harp.backend.entities.instructor;

import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.servicio.Servicio;
//import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor


@Entity
@Table(name = "instructores")
public class Instructor {

    public Instructor(Usuario usuario) {
        this.usuario = usuario;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "instructor_id")
    private Set<Servicio> servicios = new HashSet<>();

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "descripcion")
    private String descripcion;

    public void agregarServicio(Servicio servicio) {
        servicios.add(servicio);
    }

    public boolean tieneEsteServicio(Servicio servicio) {
        return servicios.contains(servicio);
    }

    public boolean tieneEsteGrupo(Grupo grupo) {
        for (Servicio servicio : servicios) {
            if (servicio.tieneEsteGrupo(grupo)) {
                return true;
            }
        }
        return false;
    }

//    public String getNombre() {
//        return usuario.getNombre() + usuario.getApellido();
//    }

}
