package com.harp.backend.entities.usuario.security.config;

import com.harp.backend.entities.usuario.dto.AuthLoginRequestDTO;
import com.harp.backend.entities.usuario.dto.AuthResponseDTO;
import com.harp.backend.entities.usuario.service.UserDetailsServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    // El LOGIN se hace mediante siempre en el POSTMAPPING...
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login (@RequestBody @Valid AuthLoginRequestDTO userRequest) {
        return new ResponseEntity<>(this.userDetailsService.loginUser(userRequest), HttpStatus.OK);
    }

}
