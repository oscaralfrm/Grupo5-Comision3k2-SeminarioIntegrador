package com.harp.backend.entities.cuota;

import com.harp.backend.entities.servicio.Servicio;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios/{idServicio}")
public class CuotaController {

    @Autowired
    private ICuotaService cuotaService;

//    @GetMapping("/cuotas")
//    public ResponseEntity<List<Cuota>> getCuotasDeServicio(@PathVariable @Min(1) Long idServicio) {
//        List<Cuota> cuotas = cuotaService.findCuotasDeServicio(idServicio);
//        return ResponseEntity.ok(cuotas);
//    }

    @GetMapping("/cuotas/{idCuotas}")
    public ResponseEntity<Cuota> getCuotaById(@PathVariable @Min(1) Long idCuota) {
        Cuota instructor = cuotaService.findCuota(idCuota);
        return ResponseEntity.ok(instructor);
    }

    // ELIMINAR, TRANSACCION NO SE PUEDE
    @DeleteMapping("/cuotas/{idCuotas}")
    public ResponseEntity<Void> eliminarUnaCuota(@PathVariable Long idCuota) {
        cuotaService.deleteCuota(idCuota);
        return ResponseEntity.noContent().build();
    };

//    // EDITAR
//    @PutMapping("/cuotas/{idCuota}/anular")
//    public ResponseEntity<String> anularCuota(@PathVariable @Min(1) Long idCuota) {
//        cuotaService.anularCuota(idCuota);
//        return ResponseEntity.ok("");
//    }

    //    // EDITAR
//    @PutMapping("/cuotas/{idCuota}/pagar")
//    public ResponseEntity<String> pagarCuota(@PathVariable @Min(1) Long idCuota, @RequestBody PagoDTO pagoDTO) {
//        cuotaService.pagarCuota(idCuota);
//        return ResponseEntity.ok("");
//    }




}
