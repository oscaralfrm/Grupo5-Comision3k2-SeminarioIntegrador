package com.harp.backend.entities.permiso.service;

import com.harp.backend.entities.permiso.model.Permiso;

import java.util.List;
import java.util.Optional;

public interface IPermisoService {
    List<Permiso> getAllPermisos();
    void savePermiso(Permiso permiso);
    void deletePermiso(Long idPermiso);
    Optional<Permiso> findPermiso(Long idPermiso);
    Permiso editPermiso(Permiso permiso);
}
