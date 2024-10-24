package com.harp.backend.entities.usuario.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.suspension.model.Suspension;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellido")
    private String apellido;

    @Column(name = "nombre_usuario", unique = true)
    private String nombreUsuario;

    @Column(name = "contrasena")
    private String contrasena;

    @Column(name = "sesion_habilitada")
    private int sesionHabilitada;

    @Column(name = "dni")
    private String dni;

    @Column(name = "email")
    private String email;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "fecha_registro")
    private Date fechaRegistro;

    @Column(name = "fecha_nacimiento")
    private Date fechaNacimiento;

    // Relación con las Suspensiones... 1 a N
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Suspension> suspensiones;

    // Relación con los Perfiles... N a N
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "usuariosxperfiles",
            joinColumns = @JoinColumn(name = "usuario_id"),  // clave foránea a Usuario
            inverseJoinColumns = @JoinColumn(name = "perfil_id")  // clave foránea a Perfil
    )
    private Set<Perfil> perfiles = new HashSet<>();

    // Atributos persistentes de configuración...
    private boolean enabled;
    private boolean accountNotExpired;
    private boolean notLocked = true;
    private boolean credentialNotExpired;

}
