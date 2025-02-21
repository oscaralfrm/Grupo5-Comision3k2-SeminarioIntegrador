package com.harp.backend.entities.alumno.controller;

import com.harp.backend.entities.alumno.dto.AlumnoDTO;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.IAlumnoService;
import com.harp.backend.entities.asistencia.Asistencia;
import com.harp.backend.entities.asistencia.AsistenciaResumenDTO;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.grupo.GrupoService;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.instructor.InstructorDTO;
import com.harp.backend.entities.servicio.FileStorageService;
import com.harp.backend.entities.servicio.Servicio;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/alumnos")
public class AlumnoController {

    @Autowired
    private IAlumnoService alumnoService;

    @Autowired
    private GrupoService grupoService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<Alumno>> getAllAlumnos() {
        List<Alumno> alumnos = alumnoService.getAllAlumnos();
        return ResponseEntity.ok(alumnos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alumno> getAlumnoById(@PathVariable Long id) {
        Alumno alumno = alumnoService.findAlumno(id);
        return ResponseEntity.status(HttpStatus.OK).body(alumno);
    }

    @GetMapping("/by-nombre-usuario")
    public ResponseEntity<Alumno> getAlumnoById(@RequestParam String nombreUsuario) {
        Alumno alumno = alumnoService.findAlumnoByNombreUsuario(nombreUsuario);
        return ResponseEntity.status(HttpStatus.OK).body(alumno);
    }

    // Obtener las clases de un alumno por grupo id
    @GetMapping("/{idAlumno}/clases")
    public ResponseEntity<Map<Long, List<Clase>> > obtenerClasesDeAlumno(@PathVariable Long idAlumno,
                                                        @RequestParam boolean proximas,
                                                        @RequestParam boolean anteriores) {
        Map<Long, List<Clase>> clases = alumnoService.obtenerClasesDeAlumno(idAlumno, proximas, anteriores);
        return ResponseEntity.status(HttpStatus.OK).body(clases);
    }

    // Obtener cuantas inasistencias tuvo en un grupo
    // Cuantas asistencias tuvo en un grupo
//    @GetMapping("/{idAlumno}/grupos/{idGrupo}/historial-asistencias")
//    public ResponseEntity<List<Asistencia> > obtenerAsistenciasDeAlumno(@PathVariable Long idAlumno,
//                                                                        @PathVariable Long idGrupo) {
//        List<Asistencia> asistencias = alumnoService.obtenerAsistenciasDeAlumno(idAlumno, idGrupo);
//        return ResponseEntity.status(HttpStatus.OK).body(asistencias);
//    }

    // GET TODAS LAS INSCRIPCIONES
    //implementar filtros por estado
    @GetMapping("{idAlumno}/inscripciones")
    public ResponseEntity<List<Inscripcion>> findInscripcionesDeAlumno(@PathVariable Long idAlumno) {
        List<Inscripcion> inscripciones = alumnoService.findInscripcionesDeAlumno(idAlumno);
        return ResponseEntity.status(HttpStatus.OK).body(inscripciones);
    }

    // GET TODAS LAS INSCRIPCIONES VIGENTES
    //implementar filtros por estado
    @GetMapping("{idAlumno}/inscripciones-vigentes")
    public ResponseEntity<List<Inscripcion>> findInscripcionesVigentesDeAlumno(@PathVariable Long idAlumno) {
        List<Inscripcion> inscripciones = alumnoService.findInscripcionesVigentesDeAlumno(idAlumno);
        return ResponseEntity.status(HttpStatus.OK).body(inscripciones);
    }

    @GetMapping("{idAlumno}/inscripciones-pendientes")
    public ResponseEntity<List<Inscripcion>> findInscripcionesPendientesDeAlumno(@PathVariable Long idAlumno) {
        List<Inscripcion> inscripciones = alumnoService.findInscripcionesPendientesDeAlumno(idAlumno);
        return ResponseEntity.status(HttpStatus.OK).body(inscripciones);
    }


    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Alumno> saveAlumno(@ModelAttribute AlumnoDTO alumnoDTO) {

        MultipartFile fotoPerfil = alumnoDTO.getFotoPerfil();

        System.out.println("Servicio recibido: " + alumnoDTO);
        System.out.println("Archivo recibido: " + (fotoPerfil != null ? fotoPerfil.getOriginalFilename() : "No se envió archivo"));

        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            String fotoPerfilURL = fileStorageService.storeFile(fotoPerfil, "uploads/alumnos/fotos-perfil/");

            alumnoDTO.setFotoPerfilURL(fotoPerfilURL);
        }

        Alumno nuevoAlumno = alumnoService.createAlumno(alumnoDTO);
        return ResponseEntity.ok(nuevoAlumno);
    }

    @PutMapping(value = "/{idAlumno}", consumes = {"multipart/form-data"})
    public ResponseEntity<Alumno> editarAlumno(@PathVariable @Min(1) Long idAlumno, @ModelAttribute AlumnoDTO alumnoDTO) {

        MultipartFile fotoPerfil = alumnoDTO.getFotoPerfil();
        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            // Este servicio se encarga de guardar el archivo (por ejemplo, en el sistema de archivos o en la nube)
            // y retornar la URL donde se encuentra
            String logoUrl = fileStorageService.storeFile(fotoPerfil, "uploads/alumnos/fotos-perfil/");
            // Se asigna la URL al DTO para que el servicio la use
            alumnoDTO.setFotoPerfilURL(logoUrl);
        }

        Alumno alumnoEditado = alumnoService.editAlumno(idAlumno, alumnoDTO);
        return ResponseEntity.status(HttpStatus.OK).body(alumnoEditado);
    }

    // EDITAR
    @PutMapping(value = "/{idAlumno}/foto-perfil", consumes = {"multipart/form-data"})
    public ResponseEntity<String> editarFotoPerfilAlumno(@PathVariable @Min(1) Long idAlumno, @ModelAttribute AlumnoDTO alumnoDTO) {
        MultipartFile fotoPerfil = alumnoDTO.getFotoPerfil();
        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            // Este servicio se encarga de guardar el archivo (por ejemplo, en el sistema de archivos o en la nube)
            // y retornar la URL donde se encuentra
            String logoUrl = fileStorageService.storeFile(fotoPerfil, "uploads/fotos-perfil/");
            // Se asigna la URL al DTO para que el servicio la use
            alumnoDTO.setFotoPerfilURL(logoUrl);
        }
        alumnoService.editarFotoPerfil(idAlumno, alumnoDTO.getFotoPerfilURL());
        return ResponseEntity.status(HttpStatus.OK).body("La foto de perfil ha sido editada.");
    }

    @PostMapping("/{idAlumno}/servicios-favoritos/{idServicio}")
    public ResponseEntity<String> agregarServicioFavoritoAAlumno(@PathVariable Long idAlumno, @PathVariable Long idServicio) {
        alumnoService.agregarServicioFavoritoAAlumno(idAlumno, idServicio);
        return ResponseEntity.ok("Se ha agregado el servicio favorito al alumno.");
    }

    @DeleteMapping("/{idAlumno}/servicios-favoritos/{idServicio}")
    public ResponseEntity<String> quitarServicioFavoritoDeAlumno(@PathVariable Long idAlumno, @PathVariable Long idServicio) {
        alumnoService.quitarServicioFavoritoDeAlumno(idAlumno, idServicio);
        return ResponseEntity.ok("Se ha quitado el servicio favorito al alumno.");
    }

    @GetMapping("/{idAlumno}/servicios-favoritos")
    public ResponseEntity<List<Servicio>> getServiciosFavoritosDeAlumno(@PathVariable Long idAlumno) {
        List<Servicio> serviciosFavoritos = alumnoService.getServiciosFavoritosDeAlumno(idAlumno);
        return ResponseEntity.ok(serviciosFavoritos);
    }


}
