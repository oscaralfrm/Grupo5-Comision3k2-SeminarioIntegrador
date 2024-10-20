package com.harp.backend.entities.suspension.service;

import com.harp.backend.entities.suspension.model.Suspension;

import java.util.List;
import java.util.Optional;

public interface ISuspensionService {
    List<Suspension> getAllSuspensiones();
    Suspension saveSuspension(Suspension suspension);
    void deleteSuspension(Long idSuspension);
    Optional<Suspension> findSuspension(Long idSuspension);
    Suspension editSuspension(Suspension suspension);
}
