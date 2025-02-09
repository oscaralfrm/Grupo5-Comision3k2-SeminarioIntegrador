package com.harp.backend.entities.servicio;

import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.frecuenciaPago.TipoCiclo;
import com.harp.backend.entities.instructor.Instructor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Data
@NoArgsConstructor
@AllArgsConstructor

// Validar que si me llega tipo de frecuencia "Con fecha limite" tengo que tener si o si un valor en diaLimitePago != null.
//Validar que si es "FechaInicioFin" entonces que tenga valores fechas != null

public class ServicioDTO {
    // Generales
    @NotEmpty(message = "El nombre es requerido")
    private String nombre;

    @NotEmpty(message = "La descripción es requerida")
    private String descripcion;

    private String logoURL;
    private MultipartFile logo;

    private String ubicacion;

    // Instructor loggeado
    private Long idInstructor;

    // Tambien podria ser el id
    private String categoria;

    // Tipo frecuencia id: segun si es "A mes calendario" "Con fecha limite" "Segun inscripcion" "Cada X dias"
    //private Long frecuenciaPagoId;
    private TipoCiclo tipoCiclo;

    // SI es con fecha limite
    private Integer diaLimitePago;

    //Si es cada X cantidad de dias
    // private int cantDiasCiclo;

    private int cantCiclo;
    private ChronoUnit unidadCiclo; // Meses Semanas Dias

    // Cantidades
    private int cantMaxAlumnosPorGrupo;
    private int cantHorariosPorGrupo;

    // Modalidad: puede ser AGrupo AServicio
    private String modalidadInscripcion;

    private String modalidadClases;


    private LocalDate fechaInicio;
//    private LocalDate fechaFin;

    // Si es Modalidad +duracion
    private int duracionTotalMeses;

    // Personalizables
    //private boolean activo; //activo que se esta cobrando
    private boolean publico; //publico que se publicita
    private boolean claseDePrueba;
    private boolean asistenciasActivas;

    private double montoInscripcion;
    // private boolean pagoAnticipadoDeMontoInscripcion;
    //private boolean pagoAnticipadoDePrimeraCuota;
}





