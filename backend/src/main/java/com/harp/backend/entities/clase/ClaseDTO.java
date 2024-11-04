package com.harp.backend.entities.clase;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ClaseDTO {
    private String observaciones;
    private boolean noFueDada;
}
