package com.harp.backend.entities.usuario.dto;

import jakarta.validation.constraints.NotBlank;



public record AuthLoginRequestDTO( @NotBlank String username, @NotBlank String password) {
}
