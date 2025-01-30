package com.harp.backend.solicitudCambioGrupo;

import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.inscripcion.EstadoInscripcion;
import com.harp.backend.entities.inscripcion.Inscripcion;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor

@Entity
@Table(name = "solicitud_cambio_curso")
public class SolicitudCambioGrupo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "inscripcion_id")
    private Inscripcion inscripcion;

    @ManyToOne
    @JoinColumn(name = "grupo_id")
    private Grupo grupoElegido;

    @Setter(AccessLevel.NONE)
    @Column(name = "fecha_solicitud")
    private LocalDate fechaSolicitud = LocalDate.now();

    public SolicitudCambioGrupo(Inscripcion inscripcion, Grupo grupoElegido) {
        this.inscripcion = inscripcion;
        this.grupoElegido = grupoElegido;
    }

    // agregar en la base de datos
    @Column(name = "fecha_aceptacion")
    private LocalDate fechaAceptacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "nombre_estado")
    private EstadoInscripcion estado = EstadoInscripcion.PendienteAceptacion;

    public void aceptar() {
        if (! this.estaPendiente()) {
            throw new UnsupportedOperationException("La solicitud no puede ser aceptada");
        }

        this.estado = EstadoInscripcion.Aceptada;
        this.fechaAceptacion = LocalDate.now();
    }

    public void rechazar() {
        if (! this.estaPendiente()) {
            throw new UnsupportedOperationException("La solicitud no puede ser rechazada");
        }

        this.estado = EstadoInscripcion.Rechazada;
    }

    public boolean estaPendiente() {
        return this.estado.equals(EstadoInscripcion.PendienteAceptacion);
    }
}
