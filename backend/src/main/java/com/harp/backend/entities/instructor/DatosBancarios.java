package com.harp.backend.entities.instructor;

import com.harp.backend.entities.inscripcion.Inscripcion;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "datos_bancarios")
public class DatosBancarios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // Datos bancarios
    private String alias;
    //private String bic; // (Bank Identifier Code)
    private String cbu;
    // Datos adicionales
    private String tipoCuenta;          // Por ejemplo, "Cuenta Corriente" o "Caja de Ahorro"
    private String banco;               // Nombre o código del banco
    private String cuit; // private String cuil

//    public DatosBancarios(Instructor instructor) {
//        this.instructor = instructor;
//    }

//    @OneToOne
//    @JoinColumn(name = "instructor_id", nullable = false)
//    private Instructor instructor;

    public boolean estanCompletos() {

        return ( ! (alias == null || alias.isBlank()) && ! (cbu == null || cbu.isBlank()) &&
                !(banco == null || banco.isBlank()) && ! (cuit == null || cuit.isBlank()));
    }

    public void completarDatos(DatosBancarios datosBancarios) {
        this.setCbu(datosBancarios.getCbu());
        this.setCuit(datosBancarios.getCuit());
        this.setAlias(datosBancarios.getAlias());
        this.setBanco(datosBancarios.getBanco());
        this.setTipoCuenta(datosBancarios.getTipoCuenta());
    }
}
