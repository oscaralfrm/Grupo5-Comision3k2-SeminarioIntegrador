package com.harp.backend.entities.clase;

import com.harp.backend.entities.horario.Horario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "clases")
public class Clase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    private String observaciones;


    private boolean noFueDada = false;

    @ManyToOne
    @JoinColumn(name = "horario_id")
    private Horario horario;

    public boolean esFutura() {

        return (fecha.isAfter(LocalDate.now())  || fecha.isEqual(LocalDate.now()));
    }

    public boolean esEn(LocalDate fecha) {
        return ( this.fecha.equals(fecha));
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Clase clase = (Clase) o;
        return Objects.equals(fecha, clase.fecha) && Objects.equals(horario, clase.horario);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fecha, horario);
    }

    public void cambiarAFueDada() {
        // Si ya fue cambiada a noFueDada=true, solo se puede volver a noFueDada=false si la clase no es futura
        if (this.noFueDada) {
            if (!this.esFutura()) {
                throw new UnsupportedOperationException("La clase es antigua y ya fue configurada a noFueDada, por lo que no se puede modificar este atributo.");
            } else {
                // La cambiamos a fueDada
                this.noFueDada = false;
            }
        }
        // Si ya esta en noFueDada = false, entonces no hacemos nada
    }

    public boolean esDeEsteMes(Month month) {
        return fecha.getMonth().equals(month);
    }

    public boolean esDeEsteAnio(Year year) {
        return year.getValue() == fecha.getYear();
    }
}
