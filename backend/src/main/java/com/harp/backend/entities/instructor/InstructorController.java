package com.harp.backend.entities.instructor;

import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.servicio.FileStorageService;
import com.harp.backend.entities.servicio.Servicio;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/instructores")
@Validated
public class InstructorController {

    @Autowired
    private IInstructorService instructorService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<Instructor>> getAllInstructores() {
        List<Instructor> instructores = instructorService.getAllInstructores();
        return ResponseEntity.ok(instructores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Instructor> getInstructorById(@PathVariable @Min(1) Long id) {
        Instructor instructor = instructorService.findInstructor(id);
        return ResponseEntity.ok(instructor);
    }

    // GET TODOS LOS SERVICIOS DE UN INSTRUCTOR
    @GetMapping("/{idInstructor}/servicios")
    public ResponseEntity<List<Servicio>> traerServiciosDeInstructor(@PathVariable Long idInstructor) {
        List<Servicio> servicios = instructorService.findServiciosDeInstructor(idInstructor);
        return ResponseEntity.status(HttpStatus.OK).body(servicios);
    };

    // GET TODOS LOS SERVICIOS PUBLICADOS DE UN INSTRUCTOR
    @GetMapping("/{idInstructor}/servicios-publicados")
    public ResponseEntity<List<Servicio>> traerServiciosPublicadosDeInstructor(@PathVariable Long idInstructor) {
        List<Servicio> servicios = instructorService.findServiciosPublicadosDeInstructor(idInstructor);
        return ResponseEntity.status(HttpStatus.OK).body(servicios);
    };

    // GET TODOS LOS SERVICIOS DE UN INSTRUCTOR
    @GetMapping("/{idInstructor}/servicios/ingresos-por-mes")
    public ResponseEntity<double[]> calcularIngresosPorMesDeServicios(@PathVariable Long idInstructor) {
        double[] totalesPorMes = instructorService.calcularIngresosPorMesDeServiciosDeInstructor(idInstructor);
        return ResponseEntity.status(HttpStatus.OK).body(totalesPorMes);
    };


    @PostMapping("/iniciar-sesion")
    public ResponseEntity<Long> iniciarSesion(@RequestBody InicioSesionDTO inicioSesionDTO) {
        Long idInstructor = instructorService.validarInicioSesion(inicioSesionDTO.getEmail(), inicioSesionDTO.getContrasena());
        return ResponseEntity.status(HttpStatus.OK).body(idInstructor);
    };

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Instructor> saveInstructor(@ModelAttribute InstructorDTO instructorDTO) {
        MultipartFile fotoPerfil = instructorDTO.getFotoPerfil();

        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            String fotoPerfilURL = fileStorageService.storeFile(fotoPerfil, "uploads/instructores/fotos-perfil/");

            instructorDTO.setFotoPerfilURL(fotoPerfilURL);
        }

        Instructor nuevoInstructor = instructorService.createInstructor(instructorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoInstructor);
    }

    // ELIMINAR
    @DeleteMapping("/{idInstructor}")
    public ResponseEntity<Void> eliminarUnInstructor(@PathVariable Long idInstructor) {
        instructorService.deleteInstructor(idInstructor);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping(value = "/{idInstructor}", consumes = {"multipart/form-data"})
    public ResponseEntity<Instructor> editarInstructor(@PathVariable @Min(1) Long idInstructor, @ModelAttribute InstructorDTO instructorDTO) {

        MultipartFile fotoPerfil = instructorDTO.getFotoPerfil();

        System.out.println("Servicio recibido: " + instructorDTO);
        System.out.println("Archivo recibido: " + (fotoPerfil != null ? fotoPerfil.getOriginalFilename() : "No se envió archivo"));
        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            // Este servicio se encarga de guardar el archivo (por ejemplo, en el sistema de archivos o en la nube)
            // y retornar la URL donde se encuentra
            String logoUrl = fileStorageService.storeFile(fotoPerfil, "uploads/instructores/fotos-perfil/");
            // Se asigna la URL al DTO para que el servicio la use
            instructorDTO.setFotoPerfilURL(logoUrl);
        }

        Instructor instructorEditado = instructorService.editInstructor(idInstructor, instructorDTO);
        return ResponseEntity.status(HttpStatus.OK).body(instructorEditado);
    }

//    // EDITAR
//    @PutMapping(value = "/{idInstructor}/foto-perfil", consumes = {"multipart/form-data"})
//    public ResponseEntity<String> editarFotoPerfilInstructor(@PathVariable @Min(1) Long idInstructor, @ModelAttribute InstructorDTO instructorDTO) {
//        MultipartFile fotoPerfil = instructorDTO.getFotoPerfil();
//
//        System.out.println("Servicio recibido: " + instructorDTO);
//        System.out.println("Archivo recibido: " + (fotoPerfil != null ? fotoPerfil.getOriginalFilename() : "No se envió archivo"));
//        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
//            // Este servicio se encarga de guardar el archivo (por ejemplo, en el sistema de archivos o en la nube)
//            // y retornar la URL donde se encuentra
//            String logoUrl = fileStorageService.storeFile(fotoPerfil, "uploads/fotos-perfil/");
//            // Se asigna la URL al DTO para que el servicio la use
//            instructorDTO.setFotoPerfilURL(logoUrl);
//        }
//        instructorService.editarFotoPerfil(idInstructor, instructorDTO.getFotoPerfilURL());
//        return ResponseEntity.status(HttpStatus.OK).body("La foto de perfil ha sido editada.");
//    }

    // AGREGAR CV
    @PutMapping(value = "/{idInstructor}/cv", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, String>> agregarCurriculumInstructor(@PathVariable @Min(1) Long idInstructor,
                                                              @ModelAttribute InstructorDTO instructorDTO) {
        MultipartFile cv = instructorDTO.getCv();
        System.out.println("en cv controller");

        System.out.println("Servicio recibido: " + instructorDTO);
        System.out.println("Archivo recibido: " + (cv != null ? instructorDTO.getCv() : "No se envió archivo"));
        if (cv != null) {
            // Este servicio se encarga de guardar el archivo (por ejemplo, en el sistema de archivos o en la nube)
            // y retornar la URL donde se encuentra
            String cvURL = fileStorageService.storeFile(cv, "uploads/instructores/curriculums/");
            // Se asigna la URL al DTO para que el servicio la use
            instructorDTO.setCvURL(cvURL);
        }
        String cvURLNuevo = instructorService.agregarCvInstructor(idInstructor, instructorDTO.getCvURL());

        // Armamos un objeto json para devolver
        Map<String, String> response = new HashMap<>();
        response.put("url", cvURLNuevo);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // EDITAR
    @PutMapping("/{idInstructor}/datos-bancarios")
    public ResponseEntity<String> completarDatosBancarios(@PathVariable @Min(1) Long idInstructor, @RequestBody DatosBancarios datosBancarios) {
        instructorService.completarDatosBancariosDeInstructor(idInstructor, datosBancarios);
        return ResponseEntity.status(HttpStatus.OK).body("Los datos bancarios fueron completados.");
    }

    // TIENE DATOS COMPLETOS BANCARIOS
    @GetMapping("/{idInstructor}/datos-bancarios-completos")
    public ResponseEntity<Boolean> tieneDatosBancariosCompletos(@PathVariable @Min(1) Long idInstructor) {
        boolean response = instructorService.tieneDatosBancariosCompletos(idInstructor);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
