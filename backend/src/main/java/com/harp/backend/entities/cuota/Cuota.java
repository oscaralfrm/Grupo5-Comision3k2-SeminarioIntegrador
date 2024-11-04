package com.harp.backend.entities.cuota;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.cuota.estadoCuota.CambioEstadoCuota;
import com.harp.backend.entities.cuota.estadoCuota.EstadoCuota;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor

@Entity
@Table(name = "cuotas")
public class Cuota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "servicio_id")
    private Servicio servicio;

    @ManyToOne
    @JoinColumn(name = "historial_monto_id")
    private MontoServicio montoServicio;

    @Column(name = "fecha_inicio_ciclo")
    private LocalDate fechaInicioCiclo;

    @Column(name = "fecha_fin_ciclo")
    private LocalDate fechaFinCiclo;

    @Column(name = "fecha_limite_pago")
    private LocalDate fechaLimitePago;

    @Setter(AccessLevel.NONE)
    @OneToMany
    @JoinColumn(name = "cuota_id")
    private List<CambioEstadoCuota> cambiosEstado;

    // El estado inicial siempre tiene que ser "Pendiente"
//    @ManyToOne
//    @JoinColumn(name = "estado_cuota_id")
//    private EstadoCuota estadoActual = EstadoCuota.Pendiente;

    public Cuota(MontoServicio montoServicio,
                 LocalDate fechaInicioCiclo, LocalDate fechaFinCiclo, LocalDate fechaLimitePago) {
        this.montoServicio = montoServicio;
        this.fechaInicioCiclo = fechaInicioCiclo;
        this.fechaFinCiclo = fechaFinCiclo;
        this.fechaLimitePago = fechaLimitePago;
    }

    //private Descuento descuento;

    public void agregarCambioEstado(CambioEstadoCuota cambioEstado) {
        cambiosEstado.add(cambioEstado);
    }

    public CambioEstadoCuota buscarCambioEstadoActual() {
        for (CambioEstadoCuota cambioEstado : this.cambiosEstado) {
            if (cambioEstado.esDeEstadoActual()) {
                return cambioEstado;
            }
        }
        throw new NoSuchElementFoundException("Estado actual de la cuota no encontrado");
    }

    public boolean esUltimaCuota() {
        return (this.fechaFinCiclo.isAfter(LocalDate.now()));
    }

    public boolean esPendiente() {
        return ( this.buscarCambioEstadoActual().esPendiente() );
    }

    public boolean estaProximaAFinalizarCiclo(LocalDate fechaActual, int diasProximos) {
        // Si faltan X "diasProximos" para que finalice el ciclo
        return fechaActual.plusDays(diasProximos).isEqual(this.fechaFinCiclo);
    }
}
