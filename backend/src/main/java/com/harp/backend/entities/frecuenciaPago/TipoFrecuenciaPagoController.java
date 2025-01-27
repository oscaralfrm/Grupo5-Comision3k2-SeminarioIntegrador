package com.harp.backend.entities.frecuenciaPago;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios/tipos-frecuencia-pago")
public class TipoFrecuenciaPagoController {

    @Autowired
    private ITipoFrecuenciaPagoService tipoFrecuenciaPagoService;

    // POST
    @PostMapping
    public ResponseEntity<TipoFrecuenciaPago> crearTipoFrecuenciaPago(@RequestBody TipoFrecuenciaPago tipoFrecuenciaPago) {
        TipoFrecuenciaPago nuevoTipoFrecuenciaPago = tipoFrecuenciaPagoService.saveTipoFrecuenciaPago(tipoFrecuenciaPago);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTipoFrecuenciaPago); // 201 CREATED
    }

    // GET DE TODOS
    @GetMapping
    public ResponseEntity<List<TipoFrecuenciaPago>> traerTiposFrecuenciaPago() {
        List<TipoFrecuenciaPago> categorias = tipoFrecuenciaPagoService.getAllTiposFrecuenciaPago();
        return ResponseEntity.status(HttpStatus.OK).body(categorias);
    };

    // GET DE UNO EN PARTICULAR
    @GetMapping("/{idTipoFrecuenciaPago}")
    public ResponseEntity<TipoFrecuenciaPago> traerUnaTipoFrecuenciaPago(@PathVariable Long idTipoFrecuenciaPago) {
        TipoFrecuenciaPago tipoFrecuenciaPago = tipoFrecuenciaPagoService.findTipoFrecuenciaPago(idTipoFrecuenciaPago);
        return ResponseEntity.status(HttpStatus.OK).body(tipoFrecuenciaPago);
    };

    // ELIMINAR
    @DeleteMapping("/{idTipoFrecuenciaPago}")
    public ResponseEntity<Void> eliminarUnaTipoFrecuenciaPago(@PathVariable Long idTipoFrecuenciaPago) {
        tipoFrecuenciaPagoService.deleteTipoFrecuenciaPago(idTipoFrecuenciaPago);
        return ResponseEntity.noContent().build();
    };

//    // EDITAR
//    @PutMapping("/{idTipoFrecuenciaPago}")
//    public TipoFrecuenciaPago editarTipoFrecuenciaPago(@PathVariable Long idTipoFrecuenciaPago, @RequestBody TipoFrecuenciaPago tipoFrecuenciaPago) {
//        TipoFrecuenciaPago tipoFrecuenciaPagoEditado = tipoFrecuenciaPagoService.editTipoFrecuenciaPago(idTipoFrecuenciaPago, tipoFrecuenciaPago);
//        return tipoFrecuenciaPagoEditado;
//    }

}
