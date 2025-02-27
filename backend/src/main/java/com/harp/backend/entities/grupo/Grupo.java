package com.harp.backend.entities.grupo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.harp.backend.entities.alumno.model.Alumno;
//import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.diaSemana.DiaSemana;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPago;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.Turno;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "grupos")
public class Grupo {
    public Grupo(Integer numero, String nombre, Integer cantMaxAlumnos) {
        this.numero = numero;
        this.nombre = nombre;
        this.cantMaxAlumnos = cantMaxAlumnos;
        this.horarios = new HashSet<>(); // Inicializa el historial de horarios vacío
        this.historialMontos = new HashSet<>(); // Inicializa el historial de montos vacío
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "numero")
    private Integer numero;
    private String nombre;

    @Column(name = "cant_max_cupos")
    private Integer cantMaxAlumnos;

    @OneToMany
    @JoinColumn(name = "grupo_id")
    private Set<Horario> horarios = new HashSet<>();

    @OneToMany
    @JoinColumn(name = "grupo_id")

    private Set<MontoServicio> historialMontos = new HashSet<>();
/*
    @ManyToMany
    @JoinTable(
            name = "alumnosxgrupos", // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "grupo_id"), // FK hacia la tabla Grupo
            inverseJoinColumns = @JoinColumn(name = "alumno_id") // FK hacia la tabla Alumno
    )
    private Set<Alumno> alumnos = new HashSet<>();
*/

    @OneToMany
    @JoinColumn(name = "grupo_id")
    private Set<Clase> clases = new HashSet<>();

    /*
        public void agregarAlumno(Alumno alumno) {
            // Revisar que el grupo tenga cupos
            if (! this.tieneCuposLibres()) {
                throw new UnsupportedOperationException("El grupo no tiene cupos libres");
            }
            alumnos.add(alumno);
        }

        public void eliminarAlumno(Alumno alumno) {
            alumnos.remove(alumno);
        }
    */
    public void agregarHorario(Horario horario) {
        horarios.add(horario);
    }

    public void agregarClase(Clase clase) {
        if (! this.tieneEstaClase(clase)) {
            clases.add(clase);
        }
    }

    public boolean tieneEstaClase(Clase otraClase) {
        return this.clases.stream().anyMatch(clase -> clase.equals(otraClase));
    }

    public void agregarMontoAHistorial(MontoServicio monto) {
        this.historialMontos.add(monto);
    }

//    public MontoServicio buscarMontoActual() {
//        for (MontoServicio monto : historialMontos) {
//            if (monto.esMontoActual()) {
//                return monto;
//            }
//        }
//        throw new NoSuchElementFoundException("Monto actual no encontrado");
//    }

    public boolean tieneMontoProgramadoFuturo() {
        if (this.historialMontos.size() == 1) {
            return false;
        }
        return historialMontos.stream().anyMatch(MontoServicio::esMontoProgramadoFuturo);
    }

    public MontoServicio obtenerMontoActual() {
        if (historialMontos.size() == 1) {
            return historialMontos.iterator().next();
        }
        return historialMontos.stream().filter(MontoServicio::esMontoActual).findFirst().orElse(null);
    }

    public MontoServicio obtenerMontoFuturo() {
        return historialMontos.stream().filter(MontoServicio::esMontoProgramadoFuturo).findFirst().orElse(null);
    }

    public MontoServicio obtenerMontoEn(LocalDate fecha) {
        // Si el mes y año son el actual el dia es el de hoy
        // Si el mes y el año son anteriores se usa el ultimo dia del mes
        // Si el mes no es null se usa esa fecha compelta

        return historialMontos.stream().filter(monto -> monto.esActualEn(fecha))
                .findFirst()
                .orElse(null);
    }

    public boolean tieneMontoActualConfigurado() {
        return (this.obtenerMontoActual() != null);
    }

//    public boolean tieneAEsteAlumno(Alumno alumno) {
//        return alumnos.contains(alumno);
//    }

    public boolean tieneEsteNumero(Integer numero) {
        //Revisar si es == o equals
        return (Objects.equals(this.numero, numero));
    }

    public boolean tieneEsteId(Long id) {
        //Revisar si es == o equals
        return (Objects.equals(this.id, id));
    }

//    public boolean tieneCuposLibres() {
//        return (this.cantMaxCupos > this.alumnos.size());
//    }

    public boolean tieneHorarioEn(LocalTime horaInicio, LocalTime horaFin, String diaSemana) {
        return this.horarios.stream().anyMatch(horario -> horario.estaEn(horaInicio, horaFin, diaSemana));
    }

    public List<Horario> obtenerHorariosConEstosIds(List<Long> idsHorarios) {
        // Obtenemos todos los ids de los horarios de este grupo
        List<Long> idsHorariosExistentes = this.horarios.stream().map(Horario::getId).toList();

        // Verificar si todos los IDs de la lista están presentes en los horarios
        for (Long id : idsHorarios) {
            if (!idsHorariosExistentes.contains(id)) {
                throw new IllegalArgumentException("Este grupo no tiene ese horario");
            }
        }

        // Recorro los horarios existentes y retorno los que tienen ids de la lista pasada por parametros
        return this.horarios.stream()
                .filter(horario -> idsHorarios.contains(horario.getId())).toList();
    }

    public Integer calcularVecesSemanales() {
        // si hay dos horarios el mismo dia en un grupo lo contamos como otra vez a la semana
        // aunque es el mismo dia
        return horarios.size();
    }

    public boolean tieneEstasVecesSemanales(Integer cantVecesSemanles) {
        return (this.calcularVecesSemanales().equals(cantVecesSemanles));
    }

    public long calcularHorasSemanales() {
        long horasTotales = 0;
        for (Horario horario : horarios) {
            horasTotales += horario.calcularDuracionEnHoras();
        }
        return horasTotales;

//        double horasSemanales = horarios.stream()
//                .mapToDouble(Horario::calcularCantidadHoras)
//                .sum();
    }

    public long calcularDuracionEnHorasEntreFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        long horasTotales = 0;

        // Paso 1: Calcular las horas de la primera semana parcial
        // Obtenemos el primer dia lunes del periodo entre fechas (cuando comienza la primer semana entera)
        // nos da el primer lunes de la semana a la fecha inicio, lo cual podria darnos anterior
        // por eso le sumamos una semana en caso de ser anterior
        LocalDate primerLunes = fechaInicio.with(DayOfWeek.MONDAY);
        if (!fechaInicio.isBefore(primerLunes)) {
            primerLunes = primerLunes.plusWeeks(1);
        }

        // Calculamos desde la fecha inicio hasta un dia antes del primer lunes
        horasTotales += calcularHorasDiasParciales(fechaInicio, primerLunes.minusDays(1));

        // Paso 2: Calcular las semanas completas

        // Obtenemos el ultimo lunes entre las fecha y corregimos
        LocalDate ultimoLunes = fechaFin.with(DayOfWeek.MONDAY);
        if (!fechaFin.isBefore(ultimoLunes)) {
            ultimoLunes = ultimoLunes.minusWeeks(1);
        }

        // Obtenemos la cantidad de semanas que hay entre el primer y el ultimo lunes
        // revisar porque plusDays(1)!!!
        long semanasCompletas = ChronoUnit.WEEKS.between(primerLunes, ultimoLunes.plusDays(1));
        double horasSemanales = this.calcularHorasSemanales();
        horasTotales += semanasCompletas * horasSemanales;

        // Paso 3: Calcular las horas de la última semana parcial
        // de nuevo calculamos los dias parciales entre el ultimo lunes y la fecha fin
        horasTotales += calcularHorasDiasParciales(ultimoLunes, fechaFin);

        return horasTotales;
    }

    private double calcularHorasDiasParciales(LocalDate fechaInicio, LocalDate fechaFin) {
        double horas = 0;
        // Hacemos un ciclo para recorrer cada dia de la semana
        // desde la fecha de inicio pasada por parametro
        // hasta la fecha fin controlando como condicion que la fecha inicio no se pase de la fin
        for (LocalDate fecha = fechaInicio; !fecha.isAfter(fechaFin); fecha = fecha.plusDays(1)) {
            DayOfWeek diaSemana = fecha.getDayOfWeek();
            // revisar aca porque estamos comparando
            for (Horario horario : horarios) {
                // revisar aca porque esta en diaSemana no en dayOfWeek
                if (horario.getDiaSemana().equals(diaSemana)) {
                    horas += horario.calcularDuracionEnHoras();
                }
            }
        }
        return horas;
    }

    public long calcularDuracionTotalEnDias(LocalDate fechaInicio, LocalDate fechaFin) {
        long diasTotales = 0;

        // Paso 1: Días de la primera semana parcial
        LocalDate primerLunes = fechaInicio.with(DayOfWeek.MONDAY);
        if (!fechaInicio.isBefore(primerLunes)) {
            primerLunes = primerLunes.plusWeeks(1);
        }
        diasTotales += contarDiasParciales(fechaInicio, primerLunes.minusDays(1));

        // Paso 2: Semanas completas
        LocalDate ultimoLunes = fechaFin.with(DayOfWeek.MONDAY);
        if (!fechaFin.isBefore(ultimoLunes)) {
            ultimoLunes = ultimoLunes.minusWeeks(1);
        }
        long semanasCompletas = ChronoUnit.WEEKS.between(primerLunes, ultimoLunes.plusDays(1));
        diasTotales += semanasCompletas * this.calcularVecesSemanales();
        // 3 semanas completas * 2 veces a la semana
        // me tendria que dar 6 dias

        // Paso 3: Días de la última semana parcial
        diasTotales += contarDiasParciales(ultimoLunes, fechaFin);

        return diasTotales;
    }

    private long contarDiasParciales(LocalDate fechaInicio, LocalDate fechaFin) {
        long dias = 0;
        for (LocalDate fecha = fechaInicio; !fecha.isAfter(fechaFin); fecha = fecha.plusDays(1)) {
            DayOfWeek diaSemana = fecha.getDayOfWeek();
            // revisar aca porque estamos comparando
            for (Horario horario : horarios) {
                // revisar aca porque esta en diaSemana no en dayOfWeek
                if (horario.getDiaSemana().equals(diaSemana)) {
                    dias++;
                }
            }
        }
        return dias;
    }

    public List<Clase> getClasesEn(LocalDate fecha) {
        return this.clases.stream().filter(c -> c.esEn(fecha)).toList();
    }

    public List<Clase> getClasesFuturas() {
        return this.clases.stream().filter(c -> c.esFutura()).toList();
    }

    public List<Clase> getClasesAnteriores() {
        return this.clases.stream().filter(c -> ! c.esFutura()).toList();
    }

    public boolean tieneHorariosEnTodosEstosDias(List<DayOfWeek> diasSemana) {
        // Devuelve true si todos sus horarios son en esos dias
        return this.horarios.stream().allMatch(horario -> horario.esDeAlgunoDeEstosDias(diasSemana));
    }

    public boolean esDeAlgunoDeEstosTurnos(List<Turno> turnos) {
        // Devuelve true si todos los horarios del grupo cumplen con estar dentro de los turnos de la lista
        return this.horarios.stream().allMatch(horario -> horario.esDeAlgunoDeEstosTurnos(turnos));
    }

    public double calcularCantidadHorasEnFrecuencia(TipoFrecuenciaPago frecuenciaPago) {
        if (frecuenciaPago.getUnidadCiclo().equals(ChronoUnit.MONTHS)) {
            return 4 * frecuenciaPago.getCantCiclo() * this.calcularHorasSemanales();
        } else if (frecuenciaPago.getUnidadCiclo().equals(ChronoUnit.WEEKS)) {
            return frecuenciaPago.getCantCiclo() * this.calcularHorasSemanales();
        } else if (frecuenciaPago.getUnidadCiclo().equals(ChronoUnit.DAYS)) {
            return (frecuenciaPago.getCantCiclo() / 7 ) * this.calcularHorasSemanales();
        } else {
            return 0.0;
        }
    }

    public double calcularPrecioPorHora(LocalDate fecha, TipoFrecuenciaPago frecuenciaPago) {
        // TEnemos que dividir el precio del grupo por la cantidad de horas semanales en la frecuencia de pago
        // Si tengo que se paga cada 1 semana, y es 2 hs a la semana entonces el precio es dividido 2
        // Si tengo que se paga cada 1 mes y es 2 veces a la semana entonces el precio es dividido 2hs * 4 sem = 8 hs (hs mensuales)
        MontoServicio montoServicio = this.obtenerMontoEn(fecha);
        if (montoServicio == null) {
            return 0.0;
        }
        double montoEnFecha = montoServicio.getMonto();
        double cantHorasSemanalesEnFrecuencia = this.calcularCantidadHorasEnFrecuencia(frecuenciaPago);
        if (cantHorasSemanalesEnFrecuencia != 0.0) {
            return montoEnFecha / cantHorasSemanalesEnFrecuencia;
        } else {
            return 0.0;
        }
    }

}



