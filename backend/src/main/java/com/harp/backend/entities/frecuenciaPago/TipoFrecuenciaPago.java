package com.harp.backend.entities.frecuenciaPago;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.cuota.estrategiaCrearCuota.FechasCuota;
import com.harp.backend.entities.cuota.estrategiaCrearCuota2.EstrategiaACalendario;
import com.harp.backend.entities.cuota.estrategiaCrearCuota2.EstrategiaSegunInscripcion;
import com.harp.backend.entities.cuota.estrategiaCrearCuota2.IEstrategiaCrearCuota2;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "tiposfrecuenciapago")
public class TipoFrecuenciaPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private TipoCiclo tipoCiclo;

    @Transient
    @JsonIgnore
    private IEstrategiaCrearCuota2 estrategiaCrearCuota;

    private Integer diaLimitePago;

    // Ej. Cada 1 (cantCiclo) semana (unidadCiclo).
    private Integer cantCiclo;
    private ChronoUnit unidadCiclo;

    // Revisar los tipos de pago anticipado que puede haber
    // Se podria poder querer que se pague un porcentaje de la primera cuota antes.
    // O toda la primera cuota antes
    // Cuando creamos la primera cuota creamos la cuota de pago anticipado y la primera cuota con el monto correspondiente
    // Si el monto de inscripcion es anticipado entonces se crea una cuota y la primera cuota. Sino directamente la primera cuota sumandole el monto de inscripcion.
//    private boolean pagoAnticipadoMontoInscripcion;
//    private boolean pagoAnticipadoPrimeraCuota;

    private void settearEstrategia() {
        if (tipoCiclo.equals(TipoCiclo.SegunCalendario)) {
            this.estrategiaCrearCuota = new EstrategiaACalendario();
        } else if (tipoCiclo.equals(TipoCiclo.SegunInscripcion)) {
            this.estrategiaCrearCuota = new EstrategiaSegunInscripcion();
        }
    }

    public FechasCuota calcularFechas(Cuota cuotaAnterior) {

        this.settearEstrategia();
        FechasCuota fechasNuevaCuota = this.estrategiaCrearCuota.calcularFechasCuota(cuotaAnterior, cantCiclo, unidadCiclo);

        LocalDate fechaLimitePago;

        if (this.getDiaLimitePago() == null) {
            fechaLimitePago = fechasNuevaCuota.getFechaFinCiclo();
        } else {
            fechaLimitePago = fechasNuevaCuota.getFechaInicioCiclo().plusDays(this.getDiaLimitePago());
        }

        fechasNuevaCuota.setFechaLimitePago(fechaLimitePago);
        return fechasNuevaCuota;
    }

    public FechasCuota calcularFechasPrimeraCuota(LocalDate fechaInicioActividad) {
        // La primera cuota cambia cuando
        // Es a calendario y semanal, la fecha inicio es el primer dia de la semana
        // Es a calendario y mensual, la fecha inicio es el primer dia del mes
        // Es segun inscripcion y semanal, la fecha inicio es la fecha inicio actividad
        // Es segun inscripcion y mensual, la fecha inicio es la fecha inicio actividad
        // Es segun inscripcion y cada X dias, la fecha inicio es la fecha inicio actividad

        this.settearEstrategia();
        FechasCuota fechasNuevaCuota = this.estrategiaCrearCuota.calcularFechasPrimeraCuota(fechaInicioActividad, cantCiclo, unidadCiclo);

        LocalDate fechaLimitePago;
        // Fecha Limite de pago
        if (diaLimitePago == null) {
            fechaLimitePago = fechasNuevaCuota.getFechaFinCiclo();
        } else {
            fechaLimitePago = fechasNuevaCuota.getFechaInicioCiclo().plusDays(this.getDiaLimitePago());
        }

        fechasNuevaCuota.setFechaLimitePago(fechaLimitePago);
        return fechasNuevaCuota;
    }

    public TipoFrecuenciaPago(Integer cantCiclo, ChronoUnit unidadCiclo,  Integer diaLimitePago, TipoCiclo tipoCiclo) {
        this.cantCiclo = cantCiclo;
        this.unidadCiclo = unidadCiclo;
        this.diaLimitePago = diaLimitePago;
        this.tipoCiclo = tipoCiclo;
    }
}
