package com.harp.backend.entities.resenia;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumenReseniaDTO {
    private Long idServicio;
    private float calificacion;
    private int cantResenias;
    private int cantInscriptos;
}
