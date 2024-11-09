//package com.harp.backend.entities.usuario.security.config;
//
//import com.harp.backend.entities.usuario.dto.AuthLoginRequestDTO;
//import com.harp.backend.entities.usuario.dto.AuthResponseDTO;
//import com.harp.backend.entities.usuario.model.Usuario;
//import com.harp.backend.entities.usuario.service.UserDetailsServiceImpl;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/auth")
//public class AuthenticationController {
//
//    @Autowired
//    private UserDetailsServiceImpl userDetailsService;
//
//    // Endpoint para el login con Google
//    @PostMapping("/google-login")
//    public ResponseEntity<AuthResponseDTO> googleLogin(@RequestBody @Valid GoogleAuthRequestDTO googleUser) {
//        Usuario user = userDetailsService.loginWithGoogle(googleUser.email(), googleUser.name());
//        // Generar JWT o realizar otras acciones necesarias
//        String jwt = generateJwtForUser(user); // Implementa este método según tus necesidades
//        return new ResponseEntity<>(new AuthResponseDTO(user.getEmail(), "Login exitoso", jwt, true), HttpStatus.OK);
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid AuthLoginRequestDTO userRequest) {
//        try {
//            AuthResponseDTO response = userDetailsService.loginUser(userRequest);
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        } catch (BadCredentialsException e) {
//            return new ResponseEntity<>(new AuthResponseDTO(null, e.getMessage(), null, false), HttpStatus.UNAUTHORIZED);
//        } catch (Exception e) {
//            return new ResponseEntity<>(new AuthResponseDTO(null, "Error interno del servidor", null, false), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//}
//
