package com.harp.backend.entities.anotacion.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
public class Anotacion {

    // Atributos

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAnotacion;
    private String anotacion;
    private boolean esImportante;

    // Constructores


    public Anotacion() {
    }

    public Anotacion(Long idAnotacion, String anotacion, boolean esImportante) {
        this.idAnotacion = idAnotacion;
        this.anotacion = anotacion;
        this.esImportante = esImportante;
    }

}
