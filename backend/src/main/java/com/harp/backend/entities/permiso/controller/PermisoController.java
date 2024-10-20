package com.harp.backend.entities.permiso.controller;

import com.harp.backend.entities.permiso.model.Permiso;
import com.harp.backend.entities.permiso.service.IPermisoService;
import com.harp.backend.entities.permiso.service.PermisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/permisos")
public class PermisoController {


    @Autowired
    private IPermisoService permisosService;

    @GetMapping
    public ResponseEntity<List> getAllPermisos() {
            List permisos = permisosService.getAllPermisos();
            return ResponseEntity.ok(permisos);
    }

    @GetMapping("/{id}")
    public ResponseEntity getPermisoById(@PathVariable Long id) {
            Optional permiso = permisosService.findPermiso(id);
            return (ResponseEntity) permiso.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity savePermiso(@RequestBody Permiso permiso) {
            Permiso nuevoPermiso = permisosService.savePermiso(permiso);
            return ResponseEntity.ok(nuevoPermiso);
    }


}
