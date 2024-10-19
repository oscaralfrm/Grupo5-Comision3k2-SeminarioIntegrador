//package com.harp.backend.entities.servicio;
//
//import com.harp.backend.entities.categoria.Categoria;
//import com.harp.backend.entities.grupo.Grupo;
//import com.harp.backend.entities.historialMonto.HistorialMonto;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.net.URL;
//import java.time.LocalDate;
//import java.util.List;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//
//@Entity
//@Table(name = "servicios")
//public class Servicio {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    private String nombre;
//    private String descripción;
//    private URL logo;
//    private LocalDate fechaCreacion;
//
//    private boolean activo; //activo que se esta cobrando
//    private boolean publico; //publico que se publicita
//
//    private List<Categoria> categoriasSecundarias;
//    private Categoria categoriaPrincipal;
//    //private PlanDePago planPago;
//
//    private List<Grupo> grupos;
//    private int cantMaxCupos;
//    private int cantMaxGrupos;
//
//    // Si un alumno se inscribe el 10/05 y duracion es 5meses, entonces finaliza el 10/10
//    private int duraciónTotalMeses;
//
//    //Sin importar cuando el alumno se inscriba el servicio termina esta fecha
//    private LocalDate fechaFinalización;
//
//    private List<HistorialMonto> historialMontos;
//}
