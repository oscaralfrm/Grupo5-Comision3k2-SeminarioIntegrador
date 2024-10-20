package com.harp.backend.entities.suspension.repository;

import com.harp.backend.entities.suspension.model.Suspension;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ISuspensionRepository extends JpaRepository<Suspension, Long> {
}
