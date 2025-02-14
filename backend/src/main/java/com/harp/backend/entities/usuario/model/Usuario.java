package com.harp.backend.entities.usuario.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.harp.backend.entities.alumno.dto.AlumnoDTO;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.instructor.InstructorDTO;
import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.suspension.model.Suspension;
import com.harp.backend.entities.usuario.RedesSocialesUsuario;
import jakarta.persistence.*;
import lombok.*;
import org.w3c.dom.Text;

import java.time.LocalDate;
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
    private int sesionHabilitada = 1;

    @Column(name = "dni")
    private String dni;

    @Column(name = "email")
    private String email;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "fecha_registro")
    private LocalDate fechaRegistro;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    // Foto de perfil
    private String fotoPerfilURL;

    private String biografia;

    @OneToOne(cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private RedesSocialesUsuario redesSociales = new RedesSocialesUsuario();

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
    private boolean enabled = true;
    private boolean accountNotExpired = true;
    private boolean notLocked = true;
    private boolean credentialNotExpired = true;

    public Usuario(InstructorDTO instructorDTO) {
        this.nombre = instructorDTO.getNombre();
        this.apellido = instructorDTO.getApellido();
        this.email = instructorDTO.getEmail();
        this.dni = instructorDTO.getDni();
        this.nombreUsuario = instructorDTO.getNombreUsuario();
        this.contrasena = instructorDTO.getContrasena();
        this.telefono = instructorDTO.getTelefono();
        this.direccion = instructorDTO.getDireccion();
        this.fechaNacimiento = instructorDTO.getFechaNacimiento();
        this.fechaRegistro = LocalDate.now();
        this.fotoPerfilURL = instructorDTO.getFotoPerfilURL();
    }

    public Usuario(AlumnoDTO alumnoDTO) {
        this.nombre = alumnoDTO.getNombre();
        this.apellido = alumnoDTO.getApellido();
        this.email = alumnoDTO.getEmail();
        this.nombreUsuario = alumnoDTO.getNombreUsuario();
        this.contrasena = alumnoDTO.getContrasena();
        this.telefono = alumnoDTO.getTelefono();
        this.direccion = alumnoDTO.getDireccion();
        this.fechaNacimiento = alumnoDTO.getFechaNacimiento();
        this.fechaRegistro = LocalDate.now();
        this.dni = alumnoDTO.getDni();
        this.fotoPerfilURL = alumnoDTO.getFotoPerfilURL();
    }

    public boolean esInstructor() {
        return this.perfiles.stream().anyMatch(Perfil::esInstructor);
    }

    public boolean esAlumno() {
        return this.perfiles.stream().anyMatch(Perfil::esInstructor);
    }

    public void completarRedesSociales(RedesSocialesUsuario redesSocialesNuevas) {
        if (this.redesSociales == null) {
            this.redesSociales = new RedesSocialesUsuario();
        }
        RedesSocialesUsuario redesSociales = this.redesSociales;
        redesSociales.setFacebook(redesSocialesNuevas.getFacebook());
        redesSociales.setInstagram(redesSocialesNuevas.getInstagram());
        redesSociales.setTiktok(redesSocialesNuevas.getTiktok());
        redesSociales.setTwitter(redesSocialesNuevas.getTwitter());
        redesSociales.setLinkedin(redesSocialesNuevas.getLinkedin());
        redesSociales.setYoutube(redesSocialesNuevas.getYoutube());
    }

    public boolean tieneEstaContrasena(String contrasena) {
        return this.contrasena.equals(contrasena);
    }


}
