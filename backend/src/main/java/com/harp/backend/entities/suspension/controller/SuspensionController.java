package com.harp.backend.entities.suspension.controller;

import com.harp.backend.entities.suspension.model.Suspension;
import com.harp.backend.entities.suspension.service.ISuspensionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/suspensiones")
public class SuspensionController {

    @Autowired
    private ISuspensionService suspensionService;

    @GetMapping
    public ResponseEntity<List> getAllSuspensiones() {
        List suspensiones = suspensionService.getAllSuspensiones();
        return ResponseEntity.ok(suspensiones);
    }

    @GetMapping("/{id}")
    public ResponseEntity getSuspensionById(@PathVariable Long id) {
        Optional suspension = suspensionService.findSuspension(id);
        return (ResponseEntity) suspension.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity saveSuspension(@RequestBody Suspension suspension) {
        Suspension nuevaSuspension = suspensionService.saveSuspension(suspension);
        return ResponseEntity.ok(nuevaSuspension);
    }

}
