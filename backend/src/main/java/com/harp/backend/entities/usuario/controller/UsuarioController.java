package com.harp.backend.entities.usuario.controller;


import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.instructor.InstructorDTO;
import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.perfil.service.IPerfilService;
import com.harp.backend.entities.servicio.FileStorageService;
import com.harp.backend.entities.suspension.service.ISuspensionService;
import com.harp.backend.entities.usuario.RedesSocialesUsuario;
import com.harp.backend.entities.usuario.dto.CambiarContrasenaDTO;
import com.harp.backend.entities.usuario.dto.LoginDTO;
import com.harp.backend.entities.usuario.dto.UsuarioDTO;
import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.model.UsuarioLoginResponse;
import com.harp.backend.entities.usuario.service.IUsuarioService;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Text;

import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UsuarioController {

    @Autowired
    private IUsuarioService usuarioService;

    @Autowired
    private ISuspensionService suspensionService;

    @Autowired
    private FileStorageService fileStorageService;


    @GetMapping
    public ResponseEntity<List> getAllUsers() {
        List users = usuarioService.getAllUsuarios();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity getUserById(@PathVariable Long id) {
        Usuario user = usuarioService.findUsuario(id);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @GetMapping("/by")
    public ResponseEntity getUserById(@RequestParam String nombreUsuario,
                                      @RequestParam String email,
                                      @RequestParam String dni) {
        if (!nombreUsuario.isEmpty() && email.isEmpty() && dni.isEmpty() ) {
            Usuario user = usuarioService.findUsuarioByNombreUsuario(nombreUsuario);
            return ResponseEntity.status(HttpStatus.OK).body(user);
        } else if (!email.isEmpty() && nombreUsuario.isEmpty() && dni.isEmpty()) {
            Usuario user = usuarioService.findUsuarioByEmail(nombreUsuario);
            return ResponseEntity.status(HttpStatus.OK).body(user);
        } else if (!dni.isEmpty() && nombreUsuario.isEmpty() && email.isEmpty()) {
            Usuario user = usuarioService.findUsuarioByDni(dni);
            return ResponseEntity.status(HttpStatus.OK).body(user);
        }
        return ResponseEntity.status(400).build();
    }

    @PostMapping
    public ResponseEntity createUser(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.createUsuario(usuario);
        if (nuevoUsuario != null) {
            return ResponseEntity.ok(nuevoUsuario);
        }
        return ResponseEntity.status(400).build(); // Credenciales incorrectas
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioLoginResponse> verificarUsuario(@RequestBody LoginDTO loginDTO) {
        UsuarioLoginResponse response = usuarioService.verificarCredenciales(loginDTO.getUsuario(), loginDTO.getContrasena());
        if (response != null) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).build(); // Credenciales incorrectas
    }

    // EDITAR
    @PutMapping(value = "/{idUsuario}", consumes = {"multipart/form-data"})
    public ResponseEntity<Usuario> editarUsuario(@PathVariable @Min(1) Long idUsuario, @ModelAttribute UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioService.findUsuario(idUsuario);
        MultipartFile fotoPerfil = usuarioDTO.getFotoPerfil();

        String logoUrl = "";
        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            // Este servicio se encarga de guardar el archivo (por ejemplo, en el sistema de archivos o en la nube)
            // y retornar la URL donde se encuentra
            if (usuario.esInstructor()) {
                logoUrl = fileStorageService.storeFile(fotoPerfil, "uploads/instructores/fotos-perfil/");
            } else if (usuario.esAlumno() ) {
                logoUrl = fileStorageService.storeFile(fotoPerfil, "uploads/alumnos/fotos-perfil/");
            }

            // Se asigna la URL al DTO para que el servicio la use
            usuarioDTO.setFotoPerfilURL(logoUrl);
        }

        Usuario usuarioEditado = usuarioService.editUsuario(idUsuario, usuarioDTO);
        return ResponseEntity.status(HttpStatus.OK).body(usuarioEditado);
    }

    // EDITAR
    @PutMapping(value = "/{idUsuario}/foto-perfil", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, String>> editarFotoPerfilUsuario(@PathVariable @Min(1) Long idUsuario,
                                                                       @ModelAttribute UsuarioDTO usuarioDTO) {

        Usuario usuario = usuarioService.findUsuario(idUsuario);
        MultipartFile fotoPerfil = usuarioDTO.getFotoPerfil();
        System.out.println("en foto perfil");
        String logoUrl = "";
        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            // Este servicio se encarga de guardar el archivo (por ejemplo, en el sistema de archivos o en la nube)
            // y retornar la URL donde se encuentra

            logoUrl = fileStorageService.storeFile(fotoPerfil, "uploads/fotos-perfil/");


            System.out.println("logoURL" + logoUrl);
            // Se asigna la URL al DTO para que el servicio la use
            usuarioDTO.setFotoPerfilURL(logoUrl);
        }
        String nuevURL = usuarioService.editarFotoPerfil(idUsuario, usuarioDTO.getFotoPerfilURL());
        System.out.println("nueva url"+ nuevURL);

        // Armamos un objeto json para devolver
        Map<String, String> response = new HashMap<>();
        response.put("url", nuevURL);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // EDITAR
    @PutMapping("/{idUsuario}/biografia")
    public ResponseEntity<String> editarBiografiaUsuario(@PathVariable @Min(1) Long idUsuario,
                                                          @RequestBody UsuarioDTO usuarioDTO) {
        usuarioService.editarBiografia(idUsuario, usuarioDTO.getBiografia());
        return ResponseEntity.status(HttpStatus.OK).body("La biografia ha sido editada.");
    }

    // EDITAR
    @PutMapping("/{idUsuario}/redes-sociales")
    public ResponseEntity<String> completarRedesSociales(@PathVariable @Min(1) Long idUsuario,
                                                         @RequestBody RedesSocialesUsuario redesSocialesUsuario) {
        usuarioService.completarRedesSocialesUsuario(idUsuario, redesSocialesUsuario);
        return ResponseEntity.status(HttpStatus.OK).body("Las redes sociales del usuario han sido completadas.");
    }

    // EDITAR
    @PutMapping("/{idUsuario}/cambiar-contrasena")
    public ResponseEntity<String> cambiarContrasena(@PathVariable @Min(1) Long idUsuario,
                                                    @RequestBody CambiarContrasenaDTO cambiarContrasenaDTO) {
        usuarioService.cambiarContrasena(idUsuario, cambiarContrasenaDTO);
        return ResponseEntity.status(HttpStatus.OK).body("La contraseña ha sido cambiada.");
    }


}
