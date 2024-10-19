package com.harp.backend.entities.perfil.model;

import com.harp.backend.entities.permiso.model.Permiso;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "perfiles")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
public class Perfil {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "nombre")
    private String nombre;

    // Relación Many to Many con los Permisos...
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "perfilesxpermisos",
            joinColumns = @JoinColumn(name = "perfil_id"),  // clave foránea a Usuario
            inverseJoinColumns = @JoinColumn(name = "permiso_id")  // clave foránea a Perfil
    )
    private Set<Permiso> permisos = new HashSet<>();


}
