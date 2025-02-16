package com.harp.backend.entities.usuario.service;

import com.harp.backend.entities.alumno.dto.AlumnoDTO;
import com.harp.backend.entities.instructor.InstructorDTO;
import com.harp.backend.entities.usuario.RedesSocialesUsuario;
import com.harp.backend.entities.usuario.dto.CambiarContrasenaDTO;
import com.harp.backend.entities.usuario.dto.UsuarioDTO;
import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.model.UsuarioLoginResponse;
import org.w3c.dom.Text;

import java.util.List;
import java.util.Optional;

public interface IUsuarioService {
    List<Usuario> getAllUsuarios();
    Usuario saveUsuario(Usuario usuario);
    Usuario createUsuario(Usuario usuario);
    Usuario createUsuarioDeAlumno(AlumnoDTO alumnoDTO);
    Usuario createUsuarioDeInstructor(InstructorDTO instructorDTO);
    void deleteUsuario(Long idUsuario);
    Usuario findUsuario(Long idUsuario);
    Usuario findUsuarioByNombreUsuario(String nombreUsuario);
    Usuario findUsuarioByEmail(String email);
    Usuario findUsuarioByDni(String dni);
    Usuario editUsuario(Long idUsuario, UsuarioDTO usuarioDTO);
    String editarFotoPerfil(Long idUsuario, String fotoPerfilURL);
    void editarBiografia(Long idUsuario, String biografia);
    void completarRedesSocialesUsuario(Long idUsuario, RedesSocialesUsuario redesSociales);
    void cambiarContrasena(Long idUsuario, CambiarContrasenaDTO cambiarContrasenaDTO);
    UsuarioLoginResponse verificarCredenciales(String usuario, String contrasena); // Actualización
    // éste último es el method para poder verificar y devolver tanto el tipo de perfil, como el ID.
//    public String encriptPassword(String password);
}
