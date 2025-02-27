package com.harp.backend.entities.instructor;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;
//import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor


@Entity
@Table(name = "instructores")
public class Instructor {

    public Instructor(Usuario usuario) {
        this.usuario = usuario;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "instructor_id")
    private Set<Servicio> servicios = new HashSet<>();

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "descripcion")
    private String descripcion;

    @OneToOne(cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DatosBancarios datosBancarios = new DatosBancarios();

    private String cvURL;

    public void completarDatosBancarios(DatosBancarios datosBancarios) {
        if (this.datosBancarios == null) {
            this.datosBancarios = new DatosBancarios();
        }
        this.datosBancarios.completarDatos(datosBancarios);
    }

    public boolean tieneDatosBancariosCompletos() {
        if (this.datosBancarios == null ) {
            return false;
        }
        return this.datosBancarios.estanCompletos();
    }

    public void agregarServicio(Servicio servicio) {
        servicios.add(servicio);
    }

    public boolean tieneEsteServicio(Servicio servicio) {
        return servicios.contains(servicio);
    }

    public boolean tieneEsteGrupo(Grupo grupo) {
        for (Servicio servicio : servicios) {
            if (servicio.tieneEsteGrupo(grupo)) {
                return true;
            }
        }
        return false;
    }

//    public String getNombre() {
//        return usuario.getNombre() + usuario.getApellido();
//    }

    public boolean tieneServicioConEsteNombre(String nombreServicio) {
        return this.servicios.stream().anyMatch(servicio -> servicio.getNombre().equals(nombreServicio));
    }

    public List<Inscripcion> obtenerUltimasInscripcionesNoPendientesDeServicios(int cant) {
         return this.getServicios()
                 .stream()
                 .flatMap(servicio -> servicio.getInscripciones().stream())
                 //Hacemos reversed para devolver las mas nuevas al principio
                 .sorted(Comparator.comparing(Inscripcion::getFechaSolicitud).reversed())
                 .limit(cant)
                 .collect(Collectors.toList());
    }

    public List<Inscripcion> obtenerSolicitudesInscripcionPendientes() {
        return this.getServicios()
                .stream()
                .flatMap(servicio -> servicio.obtenerInscripcionesPendientes().stream())
                //Hacemos reversed para devolver las mas nuevas al principio
                .sorted(Comparator.comparing(Inscripcion::getFechaSolicitud).reversed())
                .collect(Collectors.toList());
    }

    public List<Servicio> obtenerServiciosConInscripciones() {
        return this.servicios.stream().filter(Servicio::tieneAlumnosConInscripcionesActivas).toList();
    }

    public double calcularTiempoPromedioRespuestaSolicitudesEnDias(Integer day, Month month, Year year) {
        return this.obtenerServiciosConInscripciones()
                .stream()
                .mapToDouble(servicio -> servicio.calcularTiempoPromedioRespuestaSolicitudesEnDias(day, month, year) )
                .average().orElse(0.0);
    }

    public int calcularCantidadAlumnos(Month month, Year year) {
        return this.obtenerServiciosConInscripciones()
                .stream()
                .mapToInt(servicio -> servicio.calcularCantidadAlumnos(month, year) )
                .sum();
    }

    public double calcularPorcentajeSolicitudesAceptadas(Integer day, Month month, Year year) {
        return this.obtenerServiciosConInscripciones()
                .stream()
                .mapToDouble(servicio -> servicio.calcularPorcentajeSolicitudesAceptadas(day, month, year) )
                .average().orElse(0.0);
    }

    public int contarSolicitudesInscripcionEn(Integer day, Month month, Year year) {
        return this.obtenerServiciosConInscripciones()
                .stream()
                .mapToInt(servicio -> servicio.contarSolicitudesInscripcionEn(day, month, year) )
                .sum();
    }

    public double calcularDemoraPromedioDeAlumnosEnAbonar(Month month, Year year) {
        return this.obtenerServiciosConInscripciones()
                .stream()
                .mapToDouble(servicio -> servicio.calcularDemoraPromedioDeAlumnosEnAbonar(month, year))
                .average().orElse(0.0);
    }

    public double calcularPorcentajePromedioDeVencimientos(Month month, Year year) {
        return this.obtenerServiciosConInscripciones()
                .stream()
                .mapToDouble(servicio -> servicio.calcularPorcentajePromedioDeVencimientos(month, year))
                .average().orElse(0.0);
    }

    public double[] calcularTotalIngresosServiciosPorMes(Year year) {
        double[] totalIngresosServiciosPorMes = new double[12];

        for (Servicio servicio : servicios) {
            double[] ingresosPorMesUnServicio = servicio.calcularIngresosPorMes(year);
            for (int i = 0; i < 12; i++) {
                totalIngresosServiciosPorMes[i] += ingresosPorMesUnServicio[i];
            }
        }

        return totalIngresosServiciosPorMes;
    }

    public List<Double> calcularIngresosRecibidosYEsperados(Month month, Year year) {
        double totalRecibidos = 0.0;
        double totalEsperados = 0.0;
        for (Servicio servicio : servicios) {
            List<Double> ingresosServicio = servicio.calcularIngresosRecibidoYEsperado(month, year);
            totalRecibidos += ingresosServicio.get(0);
            totalEsperados += ingresosServicio.get(1);
        }
        return List.of(totalRecibidos, totalEsperados);
    }
}
