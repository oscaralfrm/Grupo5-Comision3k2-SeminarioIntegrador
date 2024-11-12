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

    public Pago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }
}
