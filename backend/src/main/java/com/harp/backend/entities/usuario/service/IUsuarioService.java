package com.harp.backend.entities.usuario.service;

import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.model.UsuarioLoginResponse;

import java.util.List;
import java.util.Optional;

public interface IUsuarioService {
    List<Usuario> getAllUsuarios();
    Usuario saveUsuario(Usuario usuario);
    void deleteUsuario(Long idUsuario);
    Optional<Usuario> findUsuario(Long idUsuario);
    Usuario editUsuario(Usuario usuario);
    UsuarioLoginResponse verificarCredenciales(String email, String contrasena); // Actualización
    // éste último es el method para poder verificar y devolver tanto el tipo de perfil, como el ID.
//    public String encriptPassword(String password);
}
