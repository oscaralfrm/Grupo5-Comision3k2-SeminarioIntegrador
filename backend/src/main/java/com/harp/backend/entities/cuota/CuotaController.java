package com.harp.backend.entities.cuota;

import com.harp.backend.entities.alumno.service.IAlumnoService;
import com.harp.backend.entities.servicio.IServicioService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
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

    @Autowired
    private IAlumnoService alumnoService;

    @Autowired
    private ServicioService servicioService;

//    @GetMapping("/cuotas")
//    public ResponseEntity<List<Cuota>> getCuotasDeServicio(@PathVariable @Min(1) Long idServicio) {
//        List<Cuota> cuotas = cuotaService.findCuotasDeServicio(idServicio);
//        return ResponseEntity.ok(cuotas);
//    }

    @GetMapping("/alumnos/cuotas/{idCuota}")
    public ResponseEntity<Cuota> getCuotaById(@PathVariable @Min(1) Long idCuota) {
        Cuota cuotas = cuotaService.findCuota(idCuota);
        return ResponseEntity.ok(cuotas);
    }

    @GetMapping("/alumnos/{idAlumno}/cuotas")
    public ResponseEntity<List<Cuota>> getCuotasDeAlumnosYServicio(@PathVariable @Min(1) Long idAlumno,
                                                            @PathVariable @Min(1) Long idServicio) {
        List<Cuota> cuotas = alumnoService.obtenerHistorialCuotasEsteAlumnoYServicio(idAlumno, idServicio);
        return ResponseEntity.ok(cuotas);
    }

    // REVISAR COMO HACER PARA QUE LAS CUOTAS TENGAN EL ALUMNO
    @GetMapping("/alumnos/cuotas")
    public ResponseEntity<List<Cuota>> getUltimasCuotasDeServicio(@PathVariable @Min(1) Long idServicio) {
        // revisar si las cuotas llegan con el alumno o necesitan de un dto
        List<Cuota> cuotas = servicioService.findUltimasCuotasDeServicio(idServicio);
        return ResponseEntity.ok(cuotas);
    }

    // ELIMINAR, TRANSACCION NO SE PUEDE
    @DeleteMapping("/alumnos/cuotas/{idCuotas}")
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
