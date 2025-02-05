package com.harp.backend.entities.resenia;

import com.harp.backend.entities.alumno.model.Alumno;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor


@Entity
@Table(name = "resenias")
public class Resenia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "alumno_id")  // Nombre de la columna en la tabla "resenias"
    private Alumno alumno;

    private int calificacion;
    private String mensaje;

    public Resenia(Alumno alumno, int calificacion, String mensaje, boolean publicada) {
        this.alumno = alumno;
        this.calificacion = calificacion;
        this.mensaje = mensaje;
        this.publicada = publicada;
    }

    private LocalDateTime fechaHora = LocalDateTime.now();
    private boolean permitida = true;
    private boolean publicada;

    public boolean tieneEstaCalificacion(int calificacion) {
        return this.calificacion == calificacion;
    }

    public boolean estaEntreEstasFechas(LocalDate fechaDesde, LocalDate fechaHasta) {
        LocalDateTime fechaHoraDesde = fechaDesde.atStartOfDay();
        LocalDateTime fechaHoraHasta = fechaHasta.atTime(23, 59); // end of day

        return ( this.fechaHora.isAfter(fechaHoraDesde) || this.fechaHora.isEqual(fechaHoraDesde) ) &&
                ( this.fechaHora.isBefore(fechaHoraHasta) || this.fechaHora.isEqual(fechaHoraHasta) );
    }

    public boolean esPositiva() {
        return this.calificacion > 5;
    }

    public boolean esDeHaceEstosDias(int dias) {
        LocalDateTime fechaActual = LocalDateTime.now();
        return this.fechaHora.plusDays(dias).isAfter(fechaActual) || this.fechaHora.plusDays(dias).isEqual(fechaActual);
    }

    public boolean sePuedeEditar() {
        // Si no esta publicada es un borrador y se puede editar
        if (! this.publicada) {
            return true;
        }
        return this.fechaHora.plusMinutes(30).isEqual(LocalDateTime.now()) || this.fechaHora.plusMinutes(30).isAfter(LocalDateTime.now())  ;
    }

    public void darDeBaja() {
        this.permitida = false;
        this.publicada = false; // revisar si lo dejamos como true
    }

    public boolean esDeEsteAlumno(Alumno alumno) {
        return this.alumno.equals(alumno);
    }
}
