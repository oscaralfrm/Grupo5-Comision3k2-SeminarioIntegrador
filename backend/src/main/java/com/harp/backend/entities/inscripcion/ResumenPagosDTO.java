package com.harp.backend.entities.inscripcion;

import lombok.*;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumenPagosDTO {
    private double demoraPromedio;
    private double porcentajeVencimientos;

    private int cantCuotas;
    private int cantVencimientos;
    private int cantCuotasPagadas;

    private int cantPagosEfectivo;
    private double porcentajePagosEfectivo;
    private double porcentajePagosTransferencia;

    public ResumenPagosDTO(double demoraPromedio, double porcentajeVencimientos,
                           int cantCuotas, int cantVencimientos, int cantCuotasPagadas,
                           double porcentajePagosEfectivo, double porcentajePagosTransferencia, double porcentajePagosMercadoPago) {
        this.demoraPromedio = demoraPromedio;
        this.porcentajeVencimientos = porcentajeVencimientos;
        this.cantCuotas = cantCuotas;
        this.cantVencimientos = cantVencimientos;
        this.cantCuotasPagadas = cantCuotasPagadas;
        this.porcentajePagosEfectivo = porcentajePagosEfectivo;
        this.porcentajePagosTransferencia = porcentajePagosTransferencia;
        this.porcentajePagosMercadoPago = porcentajePagosMercadoPago;
    }

    private double porcentajePagosMercadoPago;

}
