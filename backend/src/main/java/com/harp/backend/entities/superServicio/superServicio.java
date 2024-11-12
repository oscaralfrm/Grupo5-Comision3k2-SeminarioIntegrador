//package com.harp.backend.entities.superServicio;
//
//import com.harp.backend.entities.categoria.Categoria;
//import com.harp.backend.entities.servicio.Servicio;
//import jakarta.persistence.*;
//
//import java.time.LocalDate;
//import java.util.List;
//
//public class superServicio {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String nombre;
//    private String descripcion;
//    private String logoURL;
//    private String ubicacion;
//
//    @ManyToOne
//    @JoinColumn(name = "categoria_id", referencedColumnName = "id")
//    private Categoria categoria;
//
//    @Column(name = "fecha_creacion")
//    private LocalDate fechaCreacion = LocalDate.now(); //No puede modificarse
//
//    // Si un alumno se inscribe el 10/05 y duracion es 5meses, entonces finaliza el 10/10
//    // Cuando se cree una inscripcion tendrá fecha fin = fecha actual + servicio.duracionTotalMeses
//    @Column(name = "duracion_inscripcion")
//    private Integer duracionTotalMeses;
//
//    //Sin importar cuando el alumno se inscriba el servicio termina esta fecha
//    // Cuando se cree una inscripcion tendrá esta fecha fin programada
//
//    @Column(name = "fecha_inicio")
//    private LocalDate fechaInicio;
//
//    @Column(name = "fecha_fin")
//    private LocalDate fechaFin;
//
//    private List<Servicio> detalleServicios;
//
//
//}
