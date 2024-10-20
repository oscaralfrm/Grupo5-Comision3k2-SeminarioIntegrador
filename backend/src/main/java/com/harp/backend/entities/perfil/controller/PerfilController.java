package com.harp.backend.entities.perfil.controller;

import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.perfil.service.IPerfilService;
import com.harp.backend.entities.permiso.model.Permiso;
import com.harp.backend.entities.permiso.service.IPermisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/perfiles")
public class PerfilController {

    @Autowired
    private IPerfilService perfilService;

    @Autowired
    private IPermisoService permisoService;

    @GetMapping
    public ResponseEntity<List> getAllPerfiles() {
        List perfiles = perfilService.getAllPerfiles();
        return ResponseEntity.ok(perfiles);
    }

    @GetMapping("/{id}")
    public ResponseEntity getPerfilById(@PathVariable Long id) {
        Optional perfil = perfilService.findPerfil(id);
        return (ResponseEntity) perfil.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity createRole(@RequestBody Perfil perfil) {
        Set<Permiso> listaPermisos = new HashSet<>();
        Permiso permisoLeido;

        // Recuperar la Permission/s por su ID
        for (Permiso per : perfil.getPermisos()) {
            permisoLeido = permisoService.findPermiso(per.getId()).orElse(null);
            if (permisoLeido != null) {
                //si encuentro, guardo en la lista
                listaPermisos.add(permisoLeido);
            }
        }

        perfil.setPermisos(listaPermisos);
        Perfil nuevoPerfil = perfilService.savePerfil(perfil);
        return ResponseEntity.ok(nuevoPerfil);
    }


}
