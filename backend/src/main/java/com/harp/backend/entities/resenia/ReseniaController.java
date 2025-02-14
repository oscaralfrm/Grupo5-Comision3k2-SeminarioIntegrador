package com.harp.backend.entities.resenia;

import com.harp.backend.entities.categoria.Categoria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ReseniaController {
    @Autowired
    private IReseniaService reseniaService;

    @GetMapping("/resenias")
    public ResponseEntity<List<Resenia>> traerResenias() {
        List<Resenia> resenias = reseniaService.getAllResenias();
        return ResponseEntity.status(HttpStatus.OK).body(resenias);
    };

    @GetMapping("/resenias/{idResenia}")
    public ResponseEntity<Resenia> traerResenia(@PathVariable Long idResenia) {
        Resenia resenia = reseniaService.findResenia(idResenia);
        return ResponseEntity.status(HttpStatus.OK).body(resenia);
    };

    // hacer controller de traer reseña de un alumno y de un servicio
    @GetMapping("/alumnos/{idAlumno}/resenias/{idServicio}")
    public ResponseEntity<List<Resenia>> getReseniasDeAlumnoYServicio(@PathVariable Long idAlumno,
                                                                      @PathVariable Long idServicio,
                                                                        @RequestParam boolean publicadas,
                                                                      @RequestParam boolean borradores) {
        List<Resenia> resenias = reseniaService.getReseniasDeAlumnoYServicio(idServicio, idAlumno, publicadas, borradores);
        return ResponseEntity.status(HttpStatus.OK).body(resenias);
    };

    @GetMapping("/servicios/{idServicio}/resumen-resenias")
    public ResponseEntity<ResumenReseniaDTO> obtenerResumenReseniasDeServicio(@PathVariable Long idServicio) {
        ResumenReseniaDTO resumen = reseniaService.obtenerResumenReseniasDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(resumen);
    };

    @GetMapping("/alumnos/{idAlumno}/resenias")
    public ResponseEntity<List<Resenia>> getReseniasPublicadasOBorradoresDeAlumno(@PathVariable Long idAlumno,
                                                                       @RequestParam boolean publicadas,
                                                                       @RequestParam boolean borradores) {
        List<Resenia> resenias;
        if (publicadas && ! borradores) {
            resenias = reseniaService.getReseniasPublicadasDeAlumno(idAlumno);
        } else if (! publicadas && borradores) {
            resenias = reseniaService.getReseniasBorradorDeAlumno(idAlumno);
        } else {
            resenias = reseniaService.getReseniasDeAlumno(idAlumno);
        }
        return ResponseEntity.status(HttpStatus.OK).body(resenias);
    };

    @GetMapping("/servicios/{idServicio}/resenias")
    public ResponseEntity<List<Resenia>> getReseniasPublicadasDeServicio(@PathVariable Long idServicio) {
        List<Resenia> resenias = reseniaService.getReseniasDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(resenias);
    };

    @GetMapping("/servicios/{idServicio}/resenias/por-calificacion")
    public ResponseEntity<List<Resenia>> getReseniasPublicadasConEstaCalificacionDeServicio(@PathVariable Long idServicio,
                                                                       @RequestParam Integer calificacion) {
        List<Resenia> resenias = reseniaService.getReseniasConEstaCalificacionDeServicio(idServicio, calificacion);
        return ResponseEntity.status(HttpStatus.OK).body(resenias);
    };

    @GetMapping("/servicios/{idServicio}/resenias/por-fecha")
    public ResponseEntity<List<Resenia>> getReseniasEntreEstasFechasDeServicio(@PathVariable Long idServicio,
                                                                       @RequestParam LocalDate fechaDesde,
                                                                       @RequestParam LocalDate fechaHasta) {
        List<Resenia> resenias = reseniaService.getReseniasEntreEstasFechasDeServicio(idServicio, fechaDesde, fechaHasta);
        return ResponseEntity.status(HttpStatus.OK).body(resenias);
    };

    @GetMapping("/servicios/{idServicio}/resenias/positivas")
    public ResponseEntity<List<Resenia>> getReseñasPositivasDeServicio(@PathVariable Long idServicio) {
        List<Resenia> resenias = reseniaService.getReseñasPositivasDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(resenias);
    };

    @GetMapping("/servicios/{idServicio}/resenias/negativas")
    public ResponseEntity<List<Resenia>> getReseñasNegativasDeServicio(@PathVariable Long idServicio) {
        List<Resenia> resenias= reseniaService.getReseniasNegativasDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(resenias);
    };

    @GetMapping("/servicios/{idServicio}/resenias/limit")
    public ResponseEntity<List<Resenia>> getReseñasPositivasONegativasDeServicio(@PathVariable Long idServicio,
                                                                                 @RequestParam Integer cantidad) {
        List<Resenia> resenias = reseniaService.getUltimasReseniasDeServicio(idServicio, cantidad);
        return ResponseEntity.status(HttpStatus.OK).body(resenias);
    };

//    @GetMapping("/resenias/servicios/{idServicio}/palabras-clave")
//    public ResponseEntity<List<String>> getPalabrasClaveDeReseñasDeServicio(@PathVariable Long idServicio) {
//        List<String> palabrasClave = reseniaService.getPalabrasClaveDeReseñasDeServicio(idServicio);
//        return ResponseEntity.status(HttpStatus.OK).body(palabrasClave);
//    };


    @PostMapping("/servicios/{idServicio}/resenias/publicar")
    public ResponseEntity<Resenia> publicarResenia(@PathVariable Long idServicio,
                                                   @RequestBody ReseniaDTO reseniaDTO) {
        Resenia resenia = reseniaService.publicarResenia(idServicio, reseniaDTO);
        return ResponseEntity.status(HttpStatus.OK).body(resenia);
    };

    @PostMapping("/servicios/{idServicio}/resenias/crear-borrador")
    public ResponseEntity<Resenia> crearBorradorResenia(@PathVariable Long idServicio,
                                                        @RequestBody ReseniaDTO reseniaDTO) {
        Resenia resenia = reseniaService.crearBorradorResenia(idServicio, reseniaDTO);
        return ResponseEntity.status(HttpStatus.OK).body(resenia);
    };

    @PutMapping("/servicios/{idServicio}/resenias/{idResenia}/publicar-borrador")
    public ResponseEntity<Resenia> publicarBorradorResenia(@PathVariable Long idServicio, @PathVariable Long idResenia) {
        Resenia resenia = reseniaService.publicarBorradorResenia(idServicio, idResenia);
        return ResponseEntity.status(HttpStatus.OK).body(resenia);
    };

    @PutMapping("/servicios/{idServicio}/resenias/{idResenia}/dar-baja")
    public ResponseEntity<String> darDeBajaResenia(@PathVariable Long idServicio, @PathVariable Long idResenia) {
        reseniaService.darDeBajaResenia(idServicio, idResenia);
        return (ResponseEntity<String>) ResponseEntity.status(HttpStatus.OK);
    };

    @PutMapping("/resenias/{idResenia}")
    public ResponseEntity<Resenia> editResenia(@PathVariable Long idResenia,
                                              @RequestBody ReseniaDTO reseniaDTO) {
        Resenia resenia = reseniaService.editResenia(idResenia, reseniaDTO);
        return ResponseEntity.status(HttpStatus.OK).body(resenia);
    };

    @DeleteMapping("/resenias/{idResenia}")
    public ResponseEntity<String> deleteResenia(@PathVariable Long idResenia) {
        reseniaService.deleteResenia(idResenia);
        return ResponseEntity.status(HttpStatus.OK).body("Reseña eliminada");
    };

}
