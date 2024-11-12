package com.harp.backend.entities.cuota.estadoCuota;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor

@Entity
@Table(name = "cambiosestadocuota")
public class CambioEstadoCuota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio = LocalDate.now();

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

//    @ManyToOne
//    @JoinColumn(name = "estado_cuota_id")
    @Column(name = "estado_cuota")
    @Enumerated(EnumType.STRING)
    private EstadoCuota estadoCuota;

    public CambioEstadoCuota(EstadoCuota estadoCuota) {
        this.estadoCuota = estadoCuota;
    }

    public boolean esDeEstadoActual() {
        return ( fechaFin == null );
    }

    public boolean esPendiente() {
        return ( estadoCuota == EstadoCuota.Pendiente );
    }

    public boolean esAbonada() {
        return ( estadoCuota == EstadoCuota.Abonada );
    }

    public boolean esAnulada() {
        return ( estadoCuota == EstadoCuota.Anulada );
    }

    public boolean esVencida() {
        return ( estadoCuota == EstadoCuota.Vencida );
    }
}
