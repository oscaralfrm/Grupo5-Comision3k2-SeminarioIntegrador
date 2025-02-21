package com.harp.backend.entities.alumno.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.harp.backend.entities.asistencia.Asistencia;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;
//import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "alumnos")
public class Alumno {

    public Alumno(Usuario usuario) {
        this.usuario = usuario;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany
    @JoinColumn(name = "alumno_id")
    @JsonIgnore
    private List<Inscripcion> inscripciones = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "alumnos_servicios_favoritos",
            joinColumns = @JoinColumn(name = "alumno_id"),
            inverseJoinColumns = @JoinColumn(name = "servicio_id")
    )
    @JsonIgnore
    private List<Servicio> serviciosFavoritos = new ArrayList<>();

//    @OneToMany
//    @JoinColumn(name = "alumno_id")
//    private List<Cuota> cuotas;

    public void agregarInscripcion(Inscripcion inscripcion) {
        inscripciones.add(inscripcion);
    }

//    public void agregarCuota(Cuota cuota) {
//        cuotas.add(cuota);
//    }

    public boolean estaInscriptoAEsteServicio(Servicio servicio) {
        return inscripciones.stream()
                .filter(Inscripcion::estaEnCurso)
                .anyMatch(inscripcion -> inscripcion.esDeEsteServicio(servicio));
    }

    public boolean estaEsperandoInscripcionAEsteServicio(Servicio servicio) {
        return inscripciones.stream()
                .filter(Inscripcion::estaPendiente)
                .anyMatch(inscripcion -> inscripcion.esDeEsteServicio(servicio));
    }

    public boolean tieneEstaInscripcion (Inscripcion inscripcionExistente) {
        return inscripciones.contains(inscripcionExistente);
    }

    public boolean tieneEstaCuota (Cuota cuotaExistente) {
        return inscripciones.stream()
                .anyMatch(inscripcion -> inscripcion.getCuotas().contains(cuotaExistente));
    }

    // cuando yo quiera mostrarle las cuotas a un alumno le voy a mostrar tanto las vencidas
    // como las pendientes

    // se me vencio la cuota porque su ciclo finalizo
    // creo una nueva. de la vencida o de la pendiente o de la abonada? no me interesa traigo cualqueira
    // lo que me interesa es que sea del ultimo mes
    // pero si yo voy a crear una cuota cuando se venza la ultima, entonces quiere decir
    // que estoy ejecutando inscripcion.obtenerUltimaCuota
    // por lo tanto cuota.esUltimaCuota() justo el dia de la fecha en que su
    // fechaFinCiclo

    // pero cuando yo quiero crear nuevas cuotas
    // cuando la ultima haya finalizado su ciclo
    // se da queuna cuota sea ulimaCuota y yaFinalizoCiclo a la vez
    // ya finalizo ciclo es que finCiclo.isBefore(fechaActual)
    // ultimaCuota valida si finCiclo.isAfter()

    public List<Cuota> obtenerUltimasCuotas() {
        // obtengo la ultima cuota de cada inscripcion
        return inscripciones.stream().map(Inscripcion::obtenerUltimaCuota).toList();
    }

    public List<Cuota> obtenerCuotasPendientesDeEsteServicio(Servicio servicio) {
        // obtengo la ultima cuota de cada inscripcion
        Inscripcion inscripcion = this.obtenerInscripcionDeEsteServicio(servicio);
        return inscripcion.obtenerCuotasPendientes();
    }

    public Set<Clase> obtenerClasesEsteGrupo(Grupo grupo) {
        List<Inscripcion> inscripciones = this.obtenerInscripcionesVigentes();
        for (Inscripcion inscripcion : inscripciones) {
            if (inscripcion.esDeEsteGrupo(grupo)) {
                return inscripcion.getGrupo().getClases();
            }
        }
        throw new NoSuchElementException("No se encontró ninguna inscripción para el grupo con ID: " + grupo.getId());
    }

    public List<Cuota> obtenerHistorialCuotasEsteServicio(Servicio servicio) {
        for (Inscripcion inscripcion : inscripciones) {
            if (inscripcion.esDeEsteServicio(servicio)){
                System.out.println(inscripcion.getCuotas().size());
                return inscripcion.getCuotas();
            }
        }
        throw new NoSuchElementFoundException("Inscripcion de servicio no encontrada");
    }

    public boolean estaInscriptoAServicio() {
        return inscripciones.stream().anyMatch(Inscripcion::estaVigente);
    }

    public List<Inscripcion> obtenerInscripcionesVigentes() {
        return this.inscripciones.stream().filter(Inscripcion::estaVigente).toList();
    }

//    public Inscripcion obtenerUltimaInscripcionDeGrupo(Grupo grupo) {
//        // Te devuleve la ultima inscripcion finalizada del alumno a ese grupo
//        return this.obtenerInscripcionesQueSonOFueronVigentesOrdenadas(grupo).stream().findFirst().orElse(null);
//    }

//    public List<Inscripcion> obtenerInscripcionesQueSonOFueronVigentesOrdenadas() {
//        // Devuelve una lista ordenada de las inscripciones que estuvieron vigenetes o lo estan, del alumno a un grupo
//        // Las mas recientes quedan adelante
//        return this.inscripciones.stream()
//                .filter(inscripcion -> ! inscripcion.estaRechazada() && ! inscripcion.estaPendiente() )
//                .sorted(Comparator.comparing(Inscripcion::getFechaAceptacion).reversed());
//    }

    public Inscripcion obtenerInscripcionDeEsteServicio(Servicio servicio) {
        for (Inscripcion inscripcion : this.obtenerInscripcionesVigentes() ) {
            if ( inscripcion.esDeEsteServicio(servicio) ) {
                return inscripcion;
            }
        }
        throw new NoSuchElementFoundException("El alumno no está inscripto a ese servicio");
    }

//    public Inscripcion obtenerInscripcionDeEsteGrupo(Grupo grupo) {
//        // Devuleve la inscripcion mas reciente a ese grupo, finalizada o vigente
//        for (Inscripcion inscripcion : this.obtenerInscripcionesQueSonOFueronVigentesOrdenadas() ) {
//            if ( inscripcion.esDeEsteGrupo(grupo) ) {
//                return inscripcion;
//            }
//        }
//        throw new NoSuchElementFoundException("El alumno no está ni ha estado inscripto a ese grupo");
//    }

    public String getNombreCompleto() {
        return usuario.getNombre() + " " + usuario.getApellido();
    }

    public boolean tieneEsteId(Long id) {
        return this.id.equals(id);
    }

    public void agregarServicioAFavoritos(Servicio servicio) {
        if (this.serviciosFavoritos.contains(servicio)) {
            throw new UnsupportedOperationException("El alumno ya tiene ese servicio en favoritos.");
        }
        this.serviciosFavoritos.add(servicio);
    }

    public void quitarServicioDeFavoritos(Servicio servicio) {
        if (! this.serviciosFavoritos.contains(servicio)) {
            throw new UnsupportedOperationException("El alumno no tiene ese servicio en favoritos.");
        }
        this.serviciosFavoritos.remove(servicio);
    }

}
