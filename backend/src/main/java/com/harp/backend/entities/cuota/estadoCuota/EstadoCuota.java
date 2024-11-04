package com.harp.backend.entities.cuota.estadoCuota;

import jakarta.persistence.*;

public enum EstadoCuota {
    Pendiente,
    Vencida,
    Abonada,
    Anulada
}
