package com.harp.backend.entities.usuario.service;

import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.repository.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UsuarioService implements IUsuarioService {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Override
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario saveUsuario(Usuario usuario) {
        usuarioRepository.save(usuario);
        return null;
    }

    // Éste es el método para poder veritifcar las credenciales del usuario y con eso... en la API devolver el String. IMPORTANTE
    @Override
    public String verificarCredenciales(String email, String contrasena, String nombreUsuario) {
        Optional<Usuario> usuario = usuarioRepository.findByEmailOrNombreUsuarioAndContrasena(email, nombreUsuario, contrasena);
        if (usuario.isPresent()) {
            Set<Perfil> perfiles = usuario.get().getPerfiles();
            for (Perfil perfil : perfiles) {
                switch (perfil.getId().intValue()) {
                    case 2:
                        return "instructor";
                    case 3:
                        return "alumno";
                    default:
                        break;
                }
            }
        }
        return null;  // Devuelve null para que el controlador maneje el error
    }



    @Override
    public void deleteUsuario(Long idUsuario) {
        usuarioRepository.deleteById(idUsuario);
    }

    @Override
    public Optional<Usuario> findUsuario(Long idUsuario) {
        return usuarioRepository.findById(idUsuario);
    }

    @Override
    public Usuario editUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

//    @Override
//    public String encriptPassword(String password) {
//        return new BCryptPasswordEncoder().encode(password);
//    }
}
