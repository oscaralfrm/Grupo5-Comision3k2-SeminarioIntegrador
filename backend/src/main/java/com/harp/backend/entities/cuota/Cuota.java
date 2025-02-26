package com.harp.backend.entities.cuota;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.cuota.estadoCuota.CambioEstadoCuota;
import com.harp.backend.entities.cuota.estadoCuota.EstadoCuota;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.pagos.Pago;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor

@Entity
@Table(name = "cuotas")
public class Cuota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @ManyToOne
//    @JoinColumn(name = "servicio_id")
//    private Servicio servicio;

    @ManyToOne
    @JoinColumn(name = "historial_monto_id")
    private MontoServicio montoServicio;

    @Column(name = "recargo")
    private double recargo;

    @Column(name = "descuento")
    private double descuento = 0;

    @Column(name = "fecha_inicio_ciclo")
    private LocalDate fechaInicioCiclo;

    @Column(name = "fecha_fin_ciclo")
    private LocalDate fechaFinCiclo;

    @Column(name = "fecha_limite_pago")
    private LocalDate fechaLimitePago;

    @Setter(AccessLevel.NONE)
    @OneToMany
    @JoinColumn(name = "cuota_id")
    private List<CambioEstadoCuota> cambiosEstado = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "cuota_id")
    private Pago pago;

    // El estado inicial siempre tiene que ser "Pendiente"
//    @ManyToOne
//    @JoinColumn(name = "estado_cuota_id")
//    private EstadoCuota estadoActual = EstadoCuota.Pendiente;

    public Cuota(MontoServicio montoServicio, double recargo,
                 LocalDate fechaInicioCiclo, LocalDate fechaFinCiclo, LocalDate fechaLimitePago) {
        this.montoServicio = montoServicio;
        this.recargo = recargo;
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

//    public boolean esUltimaCuota() {
//        // es ultima cuota si fechaFinCiclo es mas adelante
//        // si tiene otras cuotas Vencidas de ciclos anteriores estas no son la ultima
//        // justo antes de crear la proxima cuota, la ultima cuota es la ultima pero su fechaFinCiclo es anterior a la actual
//        // no va return (this.fechaFinCiclo.isAfter(LocalDate.now()));
//
//    }

    public boolean esPendiente() {
        return ( this.buscarCambioEstadoActual().esPendiente() );
    }

    public boolean esAbonada() {
        return ( this.buscarCambioEstadoActual().esAbonada() );
    }

    public boolean esVencida() {
        return ( this.buscarCambioEstadoActual().esVencida() );
    }

    public boolean esAnulada() {
        return ( this.buscarCambioEstadoActual().esAnulada() );
    }

    public boolean estaProximaAFinalizarCiclo(LocalDate fechaActual, int diasProximos) {
        // Si faltan X "diasProximos" para que finalice el ciclo
        return fechaActual.plusDays(diasProximos).isEqual(this.fechaFinCiclo);
    }

    public boolean estaProximaAVencerse(LocalDate fechaActual, int diasProximos) {
        // Si faltan X "diasProximos" para que finalice el ciclo
        return fechaActual.plusDays(diasProximos).isEqual(this.fechaLimitePago);
    }

    public boolean yaVencio(LocalDate fechaActual) {
        return (fechaLimitePago.isBefore(fechaActual));
    }

    public boolean yaTerminoSuCiclo(LocalDate fechaActual) {
        return (fechaFinCiclo.isBefore(fechaActual));
    }

    public boolean tieneEsteId(Long idCuota) {
        return this.id.equals(idCuota);
    }

    public boolean puedeSerPagada() {
        // Si esta abonada pero fue rechazado el pago puede abonarse nuevamente
        if (this.esAbonada() && this.pago.rechazado) {
            return true;
            // Si todavia no se pago, estará en pendiente o vencida
        } else if (this.esPendiente() || this.esVencida()) {
            return true;
        }
        // Si esta en anulada, o esta en abonada pero no rechazada, no puede abonarse
        return false;
    }

    public boolean esPagadaEnEfectivo() {
        if (! this.esAbonada()) {
            return false;
        }
        return this.getPago().esPagoEnEfectivo();
    }

    public boolean esPagadaConTransferencia() {
        if (! this.esAbonada()) {
            return false;
        }
        return this.getPago().esPagoConTransferencia();
    }

    public boolean esPagadaConMercadoPago() {
        if (! this.esAbonada()) {
            return false;
        }
        return this.getPago().esPagoConMercadoPago();
    }

    public boolean esPagadaCon(String metodoPago) {
        if (! this.esAbonada()) {
            return false;
        }
        return this.getPago().tieneEsteMetodoPago(metodoPago);
    }

    public void aplicarDescuento(double descuento) {
        this.descuento += descuento;
    }

    public boolean incluyeEstaFecha(LocalDate fecha) {
        return (fecha.isAfter(this.fechaInicioCiclo) || fecha.isEqual(this.fechaInicioCiclo) )
                && ( fecha.isBefore(this.fechaFinCiclo) || fecha.isEqual(this.fechaFinCiclo));
    }

    public boolean tieneCicloEn(Month month, Year year) {
        if (month != null && year != null) {
            return fechaInicioCiclo.getMonth().equals(month) && fechaInicioCiclo.getYear() == year.getValue();
        } else if (month == null && year != null) {
            return fechaInicioCiclo.getYear() == year.getValue();
        } else if (month != null && year == null) {
            return fechaInicioCiclo.getMonth().equals(month) && fechaInicioCiclo.getYear() == LocalDate.now().getYear();
        } else {
            return false;
        }
    }

    public double calcularTotal() {
        return this.getMontoServicio().getMonto() + this.getRecargo() - this.getDescuento();
    }
}
