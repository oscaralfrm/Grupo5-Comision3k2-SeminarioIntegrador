package com.harp.backend.entities.servicio;

import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.instructor.Instructor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ServicioDTO {
    @NotEmpty(message = "El nombre es requerido")
    private String nombre;

    @NotEmpty(message = "La descripción es requerida")
    private String descripcion;

    private String logoURL;

    @Size(min = 0)
    private int cantMaxAlumnos;

    @Size(min = 0)
    private int cantMaxGrupos;

    @Size(min = 0)
    private int duracionTotalMeses;

    private LocalDate fechaFin;

    private boolean activo; //activo que se esta cobrando
    private boolean publico; //publico que se publicita

    // Tambien podria ser el id
    private String nombreCategoria;

    private int cantDiasCiclo;
    private int diaLimitePago;

    //private Long tipoFrecuenciaPagoId;
    //private boolean claseDePrueba;
}
