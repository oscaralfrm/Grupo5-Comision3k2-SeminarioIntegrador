package com.harp.backend.entities.cuota;

import com.harp.backend.entities.alumno.service.IAlumnoService;
import com.harp.backend.entities.inscripcion.InscripcionService;
import com.harp.backend.entities.pagos.PagoDTO;
import com.harp.backend.entities.pagos.metodoPago.MetodoPago;
import com.harp.backend.entities.servicio.FileStorageService;
import com.harp.backend.entities.servicio.IServicioService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @Autowired
    private FileStorageService fileStorageService;

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
    @PutMapping("/inscripciones/{idInscripcion}/cuotas/{idCuota}/pagar")
    public ResponseEntity<String> pagarCuotaPorInstructor( @PathVariable @Min(1) Long idServicio,
                                                @PathVariable @Min(1) Long idInscripcion,
                                              @PathVariable @Min(1) Long idCuota,
                                             @RequestBody PagoDTO pagoDTO) {
        cuotaService.registrarPagoCuotaPorInstructor(idServicio, idInscripcion, idCuota, pagoDTO.getNombre());
        return ResponseEntity.ok("Se registró el pago de la cuota.");
    }

    // EDITAR
    @PostMapping(value = "/inscripciones/{idInscripcion}/cuotas/{idCuota}/pagar-comprobante", consumes = {"multipart/form-data"})
    public ResponseEntity<String> pagarCuotaPorAlumno( @PathVariable @Min(1) Long idServicio,
                                                         @PathVariable @Min(1) Long idInscripcion,
                                                          @PathVariable @Min(1) Long idCuota,
                                                          @ModelAttribute PagoDTO pagoDTO) {

        MultipartFile comprobante = pagoDTO.getComprobante();
        System.out.println("Pago recibido: " + pagoDTO);
        System.out.println("Archivo recibido: " + (comprobante != null ? comprobante.getOriginalFilename() : "No se envió archivo"));

        // Si se envió un archivo, se procesa y se almacena a través de un servicio especializado
        if (comprobante != null && !comprobante.isEmpty()) {
            // Este servicio se encarga de guardar el archivo (por ejemplo, en el sistema de archivos o en la nube)
            // y retornar la URL donde se encuentra
            String comprobanteURL = fileStorageService.storeFile(comprobante, "uploads/comprobantes/");
            // Se asigna la URL al DTO para que el servicio la use
            //pagoDTO.setComprobanteURL(comprobanteURL);

            cuotaService.registrarPagoCuotaPorAlumno(idServicio, idInscripcion, idCuota, pagoDTO.getNombre(), comprobanteURL);
            return ResponseEntity.ok("Se registró el pago de la cuota.");
        } else {
            throw new UnsupportedOperationException("Es necesario un comprobante.");
        }
    }

    @PutMapping("/inscripciones/{idInscripcion}/cuotas/{idCuota}/pagos/{idPago}/rechazar")
    public ResponseEntity<String> rechazarPagoDeCuota( @PathVariable @Min(1) Long idServicio,
                                                       @PathVariable @Min(1) Long idInscripcion,
                                                       @PathVariable @Min(1) Long idCuota,
                                                       @PathVariable @Min(1) Long idPago,
                                                       @RequestBody String motivoRechazo) {
        cuotaService.rechazarPagoDeCuota(idServicio, idInscripcion, idCuota, idPago, motivoRechazo);
        return ResponseEntity.ok("El pago de la cuota fue rechazado.");
    }
}
