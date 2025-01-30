package com.harp.backend.entities.cuota;

import com.harp.backend.entities.alumno.service.IAlumnoService;
import com.harp.backend.entities.inscripcion.InscripcionService;
import com.harp.backend.entities.pagos.PagoDTO;
import com.harp.backend.entities.pagos.metodoPago.MetodoPago;
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

    @GetMapping("/inscripciones/cuotas")
    public ResponseEntity<List<List<Object>> > getUltimasCuotasDeAlumnosDeServicio(@PathVariable @Min(1) Long idServicio) {
        List<List<Object>> cuotas = servicioService.findAlumnosConSusUltimasCuotasDeServicio(idServicio);
        return ResponseEntity.ok(cuotas);
    }

    // UNA CUOTA ESPECIFICA
    @GetMapping("/inscripciones/cuotas/{idCuota}")
    public ResponseEntity<Cuota> getCuotaById(@PathVariable @Min(1) Long idCuota) {
        Cuota cuotas = cuotaService.findCuota(idCuota);
        return ResponseEntity.ok(cuotas);
    }

//    // LAS CUOTAS DE UN ALUMNO
//    @GetMapping("/alumnos/{idAlumno}/cuotas")
//    public ResponseEntity<List<Cuota>> getCuotasDeAlumnoYServicio(@PathVariable @Min(1) Long idAlumno,
//                                                            @PathVariable @Min(1) Long idServicio) {
//        List<Cuota> cuotas = alumnoService.obtenerHistorialCuotasEsteAlumnoYServicio(idAlumno, idServicio);
//        return ResponseEntity.ok(cuotas);
//    }

    // LAS CUOTAS DE UN SS
    // REVISAR COMO HACER PARA QUE LAS CUOTAS TENGAN EL ALUMNO
    @GetMapping("/cuotas")
    public ResponseEntity<List<Cuota>> getUltimasCuotasDeServicio(@PathVariable @Min(1) Long idServicio) {
        // revisar si las cuotas llegan con el alumno o necesitan de un dto
        List<Cuota> cuotas = servicioService.findUltimasCuotasDeServicio(idServicio);
        return ResponseEntity.ok(cuotas);
    }

    // ELIMINAR, TRANSACCION NO SE PUEDE
    @DeleteMapping("/inscripciones/cuotas/{idCuotas}")
    public ResponseEntity<Void> eliminarUnaCuota(@PathVariable Long idCuota) {
        cuotaService.deleteCuota(idCuota);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping("/inscripciones/cuotas/{idCuota}/anular")
    public ResponseEntity<String> anularCuota(@PathVariable @Min(1) Long idCuota) {
        cuotaService.anularCuota(idCuota);
        return ResponseEntity.ok("Se anuló la cuota.");
    }

        // EDITAR
    @PutMapping("/inscripciones/{idInscripcion}/cuotas/{idCuota}/pagar")
    public ResponseEntity<String> pagarCuota( @PathVariable @Min(1) Long idServicio,
                                                @PathVariable @Min(1) Long idInscripcion,
                                              @PathVariable @Min(1) Long idCuota,
                                             @RequestBody PagoDTO pagoDTO) {
        cuotaService.pagarCuota(idServicio, idInscripcion, idCuota, pagoDTO.getNombre());
        return ResponseEntity.ok("Se registró el pago de la cuota.");
    }
}
