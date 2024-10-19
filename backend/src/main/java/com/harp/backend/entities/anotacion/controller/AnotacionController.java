//package com.harp.backend.entities.anotacion.controller;
//
//import com.harp.backend.entities.anotacion.model.Anotacion;
//import com.harp.backend.entities.anotacion.service.IAnotacionService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//public class AnotacionController {
//
//    // Un controller es básicamente el enrutado de la API, próximamente implementaremos patrón API Gateway...
//
//    @Autowired
//    private IAnotacionService anotacionService;
//
//    // Endpoints - NOTA, ESTOS ENDPOINTS SON DE PRUEBA, NO CORRESPONDEN A LOS REALES...
//
//    // POST
//
//    @PostMapping("/harp/anotaciones/crear")
//    public Anotacion crearAnotacion(@RequestBody Anotacion anotacion) { anotacionService.saveAnotacion(anotacion); return anotacion; }
//
//
//    // GET DE TODOS
//
//    @GetMapping("/harp/anotaciones/traer")
//    public List<Anotacion> traerAnotaciones() { return anotacionService.getAllAnotaciones(); };
//
//
//    // GET DE UNO EN PARTICULAR
//
//    @GetMapping("/harp/anotaciones/traer/{idAnotacion}")
//    public Anotacion traerUnaAnotacion(@PathVariable Long idAnotacion) { return anotacionService.findAnotacion(idAnotacion); };
//
//    // ELIMINAR
//    @DeleteMapping("/harp/anotaciones/eliminar/{idAnotacion}")
//    public void eliminarUnaAnotacion(@PathVariable Long idAnotacion) { anotacionService.deleteAnotacion(idAnotacion); };
//
//
//    // EDITAR
//    @PutMapping("/harp/anotaciones/editar/{idOriginalAnotacion}")
//    public Anotacion editarAnotacion(@PathVariable Long idOriginalAnotacion, @RequestBody Anotacion anotacionEditar) {
//        // Primero conseguimos la que se pretende editar...
//        anotacionService.editAnotacion(idOriginalAnotacion, anotacionEditar);
//        Anotacion anotacionEditado = anotacionService.findAnotacion(idOriginalAnotacion);
//        return anotacionEditado;
//
//    }
//
//
//}
