package com.harp.backend.entities.pagos;


import com.harp.backend.entities.pagos.metodoPago.MetodoPago;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor

@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "metodo_pago_id")
    private MetodoPago metodoPago;

    @Column(name = "fecha_pago")
    private LocalDate fechaPago = LocalDate.now();

    private String comprobanteURL;

    public boolean rechazado = false;

    public LocalDate fechaRechazo;
    public String motivoRechazo;

    public Pago(MetodoPago metodoPago, String comprobanteURL) {
        if (metodoPago.getNombre().equals("Transferencia")) {
            this.comprobanteURL = comprobanteURL;
        }
        this.metodoPago = metodoPago;
    }

    public Pago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public void rechazar(String motivoRechazo) {
        this.rechazado = true;
        this.fechaRechazo = LocalDate.now();
        this.motivoRechazo = motivoRechazo;
    }

    public boolean esPagoEnEfectivo() {
        if (this.metodoPago == null) {
            return false;
        }
        return this.metodoPago.equals("Efectivo");
    }

    public boolean esPagoConTransferencia() {
        if (this.metodoPago == null) {
            return false;
        }
        return this.metodoPago.equals("Transferencia");
    }

    public boolean esPagoConMercadoPago() {
        if (this.metodoPago == null) {
            return false;
        }
        return this.metodoPago.equals("Mercado Pago") || this.metodoPago.equals("MercadoPago");
    }

    public boolean tieneEsteMetodoPago(String metodoPago) {
        return this.metodoPago.getNombre().equals(metodoPago);
    }
}
