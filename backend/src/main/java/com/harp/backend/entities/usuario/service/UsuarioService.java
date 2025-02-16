package com.harp.backend.entities.usuario.service;

import com.harp.backend.entities.alumno.dto.AlumnoDTO;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.instructor.InstructorDTO;
import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.perfil.service.IPerfilService;
import com.harp.backend.entities.usuario.RedesSocialesUsuario;
import com.harp.backend.entities.usuario.dto.CambiarContrasenaDTO;
import com.harp.backend.entities.usuario.dto.UsuarioDTO;
import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.model.UsuarioLoginResponse;
import com.harp.backend.entities.usuario.repository.IUsuarioRepository;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.w3c.dom.Text;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UsuarioService implements IUsuarioService {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Autowired
    private IPerfilService perfilService;

    @Override
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario saveUsuario(Usuario usuario) {
        usuarioRepository.save(usuario);
        return null;
    }

    @Override
    public Usuario createUsuario(Usuario usuario) {
        Set<Perfil> listaPerfiles = new HashSet<>();
        Perfil perfilLeido;

        // Controlamos nombre de usuario unico
        if (existeUsuarioConEsteNombreUsuario(usuario.getNombreUsuario())) {
            throw new UnsupportedOperationException("El nombre de usuario ya existe.");
        }

        // Controlamos nombre de usuario unico
        if (existeUsuarioConEsteEmail(usuario.getEmail())) {
            throw new UnsupportedOperationException("El email ya existe.");
        }

        // Encriptamos la contraseña...
//        usuario.setContrasena(usuarioService.encriptPassword(usuario.getContrasena()));

        // Recuperar la Permission/s por su ID
        for (Perfil perfil : usuario.getPerfiles()){
            perfilLeido = perfilService.findPerfil(perfil.getId());
            listaPerfiles.add(perfilLeido);
        }

        if (!listaPerfiles.isEmpty()) {
            usuario.setPerfiles(listaPerfiles);
            usuario.setSuspensiones(new HashSet<>());

            this.saveUsuario(usuario);
            return usuario;
        }
        return null;
    }

    @Override
    public Usuario createUsuarioDeInstructor(InstructorDTO instructorDTO) {
        //Usuario
        Usuario usuario = new Usuario(instructorDTO);

        //Perfil al usuario
//        Perfil perfil = perfilService.findPerfil(2L);
        Perfil perfil = perfilService.findPerfilByNombre("instructor");
        usuario.setPerfiles(Set.of(perfil));

         Usuario usuarioCreado = this.createUsuario(usuario);
         return usuarioCreado;
    }

    @Override
    public Usuario createUsuarioDeAlumno(AlumnoDTO alumnoDTO) {
        //Usuario
        Usuario usuario = new Usuario(alumnoDTO);

        //Perfil al usuario
//        Perfil perfil = perfilService.findPerfil(2L);
        Perfil perfil = perfilService.findPerfilByNombre("alumno");
        usuario.setPerfiles(Set.of(perfil));

        Usuario usuarioCreado = this.createUsuario(usuario);
        return usuarioCreado;
    }

    public boolean existeUsuarioConEsteNombreUsuario(String nombreUsuario) {
        return this.findUsuarioByNombreUsuario(nombreUsuario) != null;
    }

    public boolean existeUsuarioConEsteEmail(String email) {
        return usuarioRepository.findByEmail(email) != null;
    }

    // Éste es el método para poder veritifcar las credenciales del usuario y con eso... en la API devolver el String. IMPORTANTE
    @Override
    public UsuarioLoginResponse verificarCredenciales(String login, String contrasena) {
        Optional<Usuario> usuario;

        // Verificamos si el usuario es un email o un nombre usuario
        if ( login.contains("@") && login.contains(".") ) {
            usuario = usuarioRepository.findByEmailAndContrasena(login, contrasena);
        } else {
            usuario = usuarioRepository.findByNombreUsuarioAndContrasena(login, contrasena);
        }

        if (usuario.isPresent()) {
            Set<Perfil> perfiles = usuario.get().getPerfiles();
            for (Perfil perfil : perfiles) {
                String perfilString = null;
                switch (perfil.getId().intValue()) {
                    case 2:
                        perfilString = "instructor";
                        break;
                    case 3:
                        perfilString = "alumno";
                        break;
                    default:
                        break;
                }
                if (perfilString != null) {
                    return new UsuarioLoginResponse(usuario.get().getId(), perfilString);
                }
            }
        }
        return null; // Usuario no encontrado o sin un perfil válido
    }

    @Override
    public void deleteUsuario(Long idUsuario) {
        usuarioRepository.deleteById(idUsuario);
    }

    @Override
    public Usuario findUsuario(Long idUsuario) {
        return usuarioRepository.findById(idUsuario).orElseThrow(() -> new NoSuchElementFoundException("Usuario no encontrado"));
    }

    @Override
    public Usuario findUsuarioByNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario);
    }

    @Override
    public Usuario findUsuarioByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public Usuario findUsuarioByDni(String dni) {
        return usuarioRepository.findByDni(dni);
    }

    @Override
    public Usuario editUsuario(Long idUsuario, UsuarioDTO usuarioDTO) {
        Usuario usuario = this.findUsuario(idUsuario);
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setApellido(usuarioDTO.getApellido());
        //instructorExistente.getUsuario().setEmail(instructorDTO.getEmail());
        usuario.setTelefono(usuarioDTO.getTelefono());
        usuario.setDireccion(usuarioDTO.getDireccion());
        usuario.setContrasena(usuarioDTO.getContrasena());
        usuario.setFechaNacimiento(usuarioDTO.getFechaNacimiento());
        if (usuarioDTO.getFotoPerfilURL() != null && usuarioDTO.getFotoPerfilURL() != "") {
            usuario.setFotoPerfilURL(usuarioDTO.getFotoPerfilURL());
        }

        return usuarioRepository.save(usuario);
    }

    public String editarFotoPerfil(Long idUsuario, String fotoPerfilURL) {
        System.out.println("en foto perfil service");
        Usuario usuario = this.findUsuario(idUsuario);
        usuario.setFotoPerfilURL(fotoPerfilURL);
        usuarioRepository.save(usuario);
        return usuario.getFotoPerfilURL();
    }

    public void editarBiografia(Long idUsuario, String biografia) {
        System.out.println("editando biografia" + biografia);
        Usuario usuario = this.findUsuario(idUsuario);
        usuario.setBiografia(biografia);
        usuarioRepository.save(usuario);
    }

    public void completarRedesSocialesUsuario(Long idUsuario, RedesSocialesUsuario redesSociales) {
        Usuario usuario = this.findUsuario(idUsuario);
        usuario.completarRedesSociales(redesSociales);
        usuarioRepository.save(usuario);
    }

    public void cambiarContrasena(Long idUsuario, CambiarContrasenaDTO cambiarContrasenaDTO) {
        Usuario usuario = this.findUsuario(idUsuario);
        if (! usuario.tieneEstaContrasena(cambiarContrasenaDTO.getContrasenaActual())) {
            throw new UnsupportedOperationException("La contraseña actual no es correcta");
        }
        usuario.setContrasena(cambiarContrasenaDTO.getContrasenaNueva());
        usuarioRepository.save(usuario);
    }

//    @Override
//    public String encriptPassword(String password) {
//        return new BCryptPasswordEncoder().encode(password);
//    }
}
