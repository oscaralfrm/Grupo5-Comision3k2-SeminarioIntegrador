package com.harp.backend.entities.usuario.model;

import lombok.Getter;
import lombok.Setter;

// Puede considerarse como una especie de DTO, la voy a usar para que pase tanto el string del tipo de perfil
// como el ID, y con eso armar la ruta...
@Getter
@Setter
public class UsuarioLoginResponse {

    private Long id;
    private String perfil;

    public UsuarioLoginResponse(Long id, String perfil) {
        this.id = id;
        this.perfil = perfil;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }

}
