package com.harp.backend.entities.suspension.service;

import com.harp.backend.entities.suspension.model.Suspension;
import com.harp.backend.entities.suspension.repository.ISuspensionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SuspensionService implements ISuspensionService {

    @Autowired
    private ISuspensionRepository suspensionRepository;

    @Override
    public List<Suspension> getAllSuspensiones() {
        return suspensionRepository.findAll();
    }

    @Override
    public Suspension saveSuspension(Suspension suspension) {
        return suspensionRepository.save(suspension);
    }

    @Override
    public void deleteSuspension(Long idSuspension) {
        suspensionRepository.deleteById(idSuspension);
    }

    @Override
    public Optional<Suspension> findSuspension(Long idSuspension) {
        return suspensionRepository.findById(idSuspension);
    }

    @Override
    public Suspension editSuspension(Suspension suspension) {
        return suspensionRepository.save(suspension);
    }
}
