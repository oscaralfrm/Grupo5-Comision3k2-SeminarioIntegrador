package com.harp.backend.entities.usuario.controller;


import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.perfil.service.IPerfilService;
import com.harp.backend.entities.suspension.service.ISuspensionService;
import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.service.IUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class UsuarioController {

    @Autowired
    private IUsuarioService usuarioService;

    @Autowired
    private IPerfilService perfilService;

    @Autowired
    private ISuspensionService suspensionService;

    @GetMapping
    public ResponseEntity<List> getAllUsers() {
        List users = usuarioService.getAllUsuarios();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity getUserById(@PathVariable Long id) {
        Optional user = usuarioService.findUsuario(id);
        return (ResponseEntity) user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity createUser(@RequestBody Usuario usuario) {

        Set<Perfil> listaPerfiles = new HashSet<>();
        Perfil perfilLeido;

        // Encriptamos la contraseña...
        usuario.setContrasena(usuarioService.encriptPassword(usuario.getContrasena()));

        // Recuperar la Permission/s por su ID
        for (Perfil perfil : usuario.getPerfiles()){
            perfilLeido = perfilService.findPerfil(perfil.getId()).orElse(null);
            if (perfilLeido != null) {
                //si encuentro, guardo en la lista
                listaPerfiles.add(perfilLeido);
            }
        }

        if (!listaPerfiles.isEmpty()) {
            usuario.setPerfiles(listaPerfiles);
            usuario.setSuspensiones(new HashSet<>());

            Usuario nuevoUsuario = usuarioService.saveUsuario(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        }
        return null;
    }
}
