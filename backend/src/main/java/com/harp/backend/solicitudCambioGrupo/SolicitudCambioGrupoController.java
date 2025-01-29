package com.harp.backend.solicitudCambioGrupo;


import com.harp.backend.entities.servicio.Servicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.AfterDomainEventPublication;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@Validated
public class SolicitudCambioGrupoController {

    @Autowired
    private ISolicitudCambioGrupoService cambioGrupoService;

    //  Ver las solicitudes de cambio de grupo de un servicio
    @GetMapping("/{idServicio}/cambios-grupo")
    public ResponseEntity<List<SolicitudCambioGrupo>> findSolicitudesCambioGrupoDeServicio(@PathVariable Long idServicio) {
        List<SolicitudCambioGrupo> solicitudes =  cambioGrupoService.findSolicitudesCambioGrupoDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(solicitudes);
    };

    // Crear solicitud de cambio de grupo
    @PostMapping("/{idServicio}/cambios-grupo")
    public ResponseEntity<SolicitudCambioGrupo> createSolictudCambioGrupo(@RequestBody SolicitudCambioGrupoDTO solicitudDTO) {
        SolicitudCambioGrupo solicitud =  cambioGrupoService.createSolicitudCambioGrupo(solicitudDTO);
        return ResponseEntity.status(HttpStatus.OK).body(solicitud);
    };

    // Aceptar solicitud de cambio de grupo
    @PutMapping("/{idServicio}/cambios-grupo/{idSolicitud}/aceptar")
    public ResponseEntity<String> aceptarSolicitudCambioGrupo(@PathVariable Long idSolicitud) {
        cambioGrupoService.aceptarSolicitudCambioGrupo(idSolicitud);
        return ResponseEntity.status(HttpStatus.OK).body("La solicitud de cambio de grupo fue aceptada");
    };


    // Rechazar solicitud de cambio de grupo
    // Aceptar solicitud de cambio de grupo
    @PutMapping("/{idServicio}/cambios-grupo/{idSolicitud}/rechazar")
    public ResponseEntity<String> rechazarSolicitudCambioGrupo(@PathVariable Long idSolicitud) {
        cambioGrupoService.rechazarSolicitudCambioGrupo(idSolicitud);
        return ResponseEntity.status(HttpStatus.OK).body("La solicitud de cambio de grupo fue rechazada");
    };

}
