package com.harp.backend.entities.permiso.service;

import com.harp.backend.entities.permiso.model.Permiso;
import com.harp.backend.entities.permiso.repository.IPermisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PermisoService implements IPermisoService {

    @Autowired
    private IPermisoRepository permisoRepository;

    @Override
    public List<Permiso> getAllPermisos() {
        return permisoRepository.findAll();
    }

    @Override
    public Permiso savePermiso(Permiso permiso) {
        permisoRepository.save(permiso);
        return permiso;
    }

    @Override
    public void deletePermiso(Long idPermiso) {
        permisoRepository.deleteById(idPermiso);
    }

    @Override
    public Optional<Permiso> findPermiso(Long idPermiso) {
        return permisoRepository.findById(idPermiso);
    }

    @Override
    public Permiso editPermiso(Permiso permiso) {
        return permisoRepository.save(permiso);
    }
}
