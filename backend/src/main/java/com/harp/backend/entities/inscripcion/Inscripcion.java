package com.harp.backend.entities.inscripcion;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.cuota.CuotaService;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.pagos.Pago;
import com.harp.backend.entities.pagos.metodoPago.MetodoPago;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Setter
@Getter
@NoArgsConstructor

@Entity
@Table(name = "inscripciones")
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "alumno_id", nullable = false)
    //@JsonIgnore
    private Alumno alumno;

    //AGREGAR EN LA BASE DE DATOS
    @Column(name = "fecha_solicitud")
    private LocalDate fechaSolicitud = LocalDate.now();

    // agregar en la base de datos
    @Column(name = "fecha_aceptacion")
    private LocalDate fechaAceptacion;

    @Column(name = "fecha_rechazo")
    private LocalDate fechaRechazo;

    @Setter(AccessLevel.NONE) // SOlo se puede modificar con el método aceptar()
    @Column(name = "fecha_inscripcion")
    private LocalDate fechaInicio;

    //AGREGAR EN LA BASE DE DATOS
    @Setter(AccessLevel.NONE)
    @Column(name = "fecha_fin_inscripcion")
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(name = "nombre_estado")
    private EstadoInscripcion estado = EstadoInscripcion.PendienteAceptacion; //PendienteAceptacion Aceptada Rechazada Finalizada

    @Column(name = "cant_veces_semanales")
    private Integer cantVecesSemanales;

    @ManyToOne
    @JoinColumn(name = "servicio_id")
    private Servicio servicio;

    @ManyToOne
    @JoinColumn(name = "grupo_id")
    private Grupo grupo;

    private String motivoRechazo;

    //HACERLO EN LA BASE DE DATOS CON TABLA INTERMEDIA
    //HAcerlo LAZY
    @ManyToMany
    @JoinTable(
            name = "horariosxinscripcion", // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "inscripcion_id"), // FK hacia la tabla Inscripcion
            inverseJoinColumns = @JoinColumn(name = "horario_id") // FK hacia la tabla Horario
    )
    @JsonIgnore
    private List<Horario> horarios;

    @OneToMany
    @JoinColumn(name = "inscripcion_id")
    @JsonIgnore
    private List<Cuota> cuotas = new ArrayList<>();

    public Inscripcion(Servicio servicio, Grupo grupo, List<Horario> horarios, Alumno alumno) {
        this.servicio = servicio;
        this.grupo = grupo;
        this.horarios = horarios;
        this.cantVecesSemanales = horarios.size();
        this.alumno = alumno;
    }

    public Inscripcion(Servicio servicio, Grupo grupo, Alumno alumno) {
        this.servicio = servicio;
        this.grupo = grupo;
        // definimos la cantidad de veces semanales como la cantidad de horarios que tiene el grupo
        this.cantVecesSemanales = grupo.getHorarios().size();
        this.alumno = alumno;
    }

    public Inscripcion(Servicio servicio, Alumno alumno) {
        this.servicio = servicio;
        this.alumno = alumno;
    }

    public void agregarCuota(Cuota cuota) {
        cuotas.add(cuota);
    }

    public boolean tieneEstaCuota (Cuota cuotaExistente) {
        return cuotas.contains(cuotaExistente);
    }

    public Cuota obtenerUltimaCuota() {
        if (cuotas == null || cuotas.isEmpty()) {
            return null; // O lanza una excepción personalizada si lo prefieres
        }
        // siempre hay una sola cuota que cumple con ser la ultima
        // pero no le podemos preguntar a la cuota si es la ultima porque debemos compararlas entre fechas
        return Collections.max(cuotas, Comparator.comparing(Cuota::getFechaInicioCiclo));
    }

    // quiero la ultima si es abonada
    // la ultima si es pendiente
    // y si tiene del mes anterior que tambien me la traiga

    public Set<Cuota> obtenerUltimasCuotas() {
        // CORREGIDO
        Set<Cuota> cuotas = new HashSet<>();
        Cuota ultimaCuota = obtenerUltimaCuota();

        cuotas.add(ultimaCuota);
        // Si hay cuotas vencidas o pendientes se agregan porque no si son pendientes o si son vencidas son ultimas
        // Al ser un set, si la ultima cuota es pendiente o vencida, no se vuelve a agregar
        cuotas.addAll(this.obtenerCuotasPendientes());
        cuotas.addAll(this.obtenerCuotasVencidas());

        // Agregamos alguna cuota anulada reciente
        cuotas.addAll(this.obtenerUltimasCuotasAnuladas());

        return cuotas;
//        if (ultimaCuota.esAbonada()) {
//            return List.of(ultimaCuota);
//        } else {
//            if (tieneEstaCantCuotasPendientes(2)) {
//                return obtenerCuotasPendientes();
//            } else {
//                return List.of(ultimaCuota);
//            }
//        }
    }

    public List<Cuota> obtenerCuotasOrdenadas() {
        // Las primeras son las mas antiguas, las ultimas las mas nuevas
        return this.getCuotas().stream().sorted(Comparator.comparing(Cuota::getFechaInicioCiclo)).collect(Collectors.toList());
    }

    public List<Cuota> obtenerUltimasCuotasAnuladas() {
        // Devolvemos las anuladas de las ultimas 3 cuotas mas recientes
        return this.obtenerCuotasOrdenadas().stream().limit(3).filter(Cuota::esAnulada).toList();
    }

    public boolean tieneEstaCantCuotasPendientes(int cant) {
        return obtenerCuotasPendientes().size() == cant;
    }

    public List<Cuota> obtenerCuotasPendientes() {
        return cuotas.stream().filter(Cuota::esPendiente).toList();
    }

    public List<Cuota> obtenerCuotasAbonadas() {
        return cuotas.stream().filter(Cuota::esAbonada).toList();
    }

    public List<Cuota> obtenerCuotasAbonadasConCicloEn(LocalDate fecha) {
        return cuotas.stream().filter(cuota -> cuota.esAbonada() && cuota.incluyeEstaFecha(fecha)).toList();
    }

    public List<Cuota> obtenerCuotasAbonadasConCicloEn(Month month, Year year) {
        return cuotas.stream().filter(cuota -> cuota.esAbonada() && cuota.tieneCicloEn(month, year)).toList();
    }

    public List<Cuota> obtenerCuotasVencidasConCicloEn(LocalDate fecha) {
        return cuotas.stream().filter(cuota -> cuota.esVencida() && cuota.incluyeEstaFecha(fecha)).toList();
    }

    public List<Cuota> obtenerCuotasVencidasConCicloEn(Month month, Year year) {
        return cuotas.stream().filter(cuota -> cuota.esVencida() && cuota.tieneCicloEn(month, year)).toList();
    }

    public List<Cuota> obtenerCuotasConCicloEn(LocalDate fecha) {
        return cuotas.stream().filter(cuota -> cuota.incluyeEstaFecha(fecha)).toList();
    }

    public List<Cuota> obtenerCuotasConCicloEn(Month month, Year year) {
        return cuotas.stream().filter(cuota -> cuota.tieneCicloEn(month, year)).toList();
    }

    public List<Cuota> obtenerCuotasVencidas() {
        return cuotas.stream().filter(Cuota::esVencida).toList();
    }

    public List<Cuota> obtenerCuotasAnuladas() {
        return cuotas.stream().filter(Cuota::esAnulada).toList();
    }

    public Cuota obtenerCuotaEn(LocalDate fecha) {
        return this.getCuotas().stream().filter(cuota -> cuota.incluyeEstaFecha(fecha)).findFirst().orElse(null);
    }

    public void iniciar() {
        // se puede iniciar si esta en pendiente o en aceptada
        // si un alumno se inscribe pagando se acepta solo
        if ( ! estaAceptada() ) {
            throw new UnsupportedOperationException("La inscripcion no puede iniciarse porque nunca fue aceptada");
        }
        LocalDate fechaActual = LocalDate.now();

        // no setteamos la fecha inicio = actual porque
        // al aceptar la inscrip ya la definimos de antemano, revisar cuando el alumno se inscriba al pagar el solo
        //this.fechaInicio = fechaActual;
        this.estado = EstadoInscripcion.EnCurso;
    }

    public void aceptar(LocalDate fechaInicioNueva, LocalDate fechaFin) {
        // La puedo aceptar solo cuando esta en pendiente
        if (! this.estaPendiente() ) {
            throw new UnsupportedOperationException("La inscripción no puede ser aceptada");
        }
        this.fechaAceptacion = LocalDate.now();

        //Revisar: si es modalidad duracion inicio-fin se debe settear la fechafin a servicio.getFechaFin()
        //pero si la modalidad es duracion desde fecha de inscripcion se debe settear la fecha fin = fechaInscricion + servicio.getDuracion()
        //pero si es modalidad duracion indefinida la fecha inscripcion no se settea, queda en null

        // Siempre vamos a tener fecha inicio, solo algunas veces fecha fin
        this.fechaInicio = fechaInicioNueva;
        this.fechaFin = fechaFin;

        //cambiar el estado a Aceptada
        this.estado = EstadoInscripcion.Aceptada;

        // En caso que la fecha inicio sea igual a la actual se inicia la inscripcion
        if (this.fechaInicio.isEqual(LocalDate.now())) {
            this.iniciar();
        }
    }

    public void rechazar(String motivo) {
        // la puedo rechazar solo cuando está en Pendiente
        if (fechaAceptacion != null) {
            throw new UnsupportedOperationException("La inscripción ya fue previamente aceptada");
        }
        if (! this.estaPendiente()) {
            throw new UnsupportedOperationException("La inscripción ya no se puede rechazar");
        }
        //cambiar el estado a Rechazada
        this.estado = EstadoInscripcion.Rechazada;
        this.fechaRechazo = LocalDate.now();
        // REVISAR si aca deberiamos cambiar la fechaFinInscripcion o no

        this.motivoRechazo = motivo;
    }

    public boolean esFinalizada() {
        return (this.estado == EstadoInscripcion.Finalizada);
    }

    public boolean esRecientementeFinalizada() {
        if (! this.esFinalizada()) {
            return false;
            // Consideramos que si fue finalizada hace una semana o menos es reciente
        } else if (this.fechaFin.plusWeeks(1).isAfter(LocalDate.now()) ||
                this.fechaFin.plusWeeks(1).isEqual(LocalDate.now())) {
            return true;
        } else {
            return false;
        }
    }

    // Implementar según tipo de duración del servicio
    // esto se llamará luego desde un proceso automático
    // si se utiliza manualmente para settear la fecha fin entonces tenemos que validar:
    // por ejemplo si el servicio decide cambiar su fecha de finalizacion
    // se tienen que modificar todas la fecha fin de todas sus inscripciones
    // puede que estas inscripciones hayan tenido o no una fecha fin definida
    public void finalizar() {
        // si no esta en aceptada entonces esta en pendiente y no puede finalizarse, sino rechazarse
        // si no esta en en curso o aceptada no puede finalizarce
        // si no esta vigente por que ya finalizó, entonces tampoco puede finalizarse
        if (! this.estaVigente()) {
            throw new UnsupportedOperationException("La inscripcion no puede finalizarce");
        }
        // si se creó con una fecha fin especifica, no puede finalizarse antes
        // pero si hoy es dia de vencerse, su fechaFin no es null pero esta fechaFin es igual a la actual entonces si puede finalizarce
//        if (fechaFin != null && fechaFin.isAfter(LocalDate.now())) {
//            throw new UnsupportedOperationException("La inscripción fue programada previamente para finalizarce en una fecha futura.");
//        }
        this.fechaFin = LocalDate.now();
        //cambiar el estado a Finalizada
        this.estado = EstadoInscripcion.Finalizada;
    }

    public void setFechaFin(LocalDate fechaFinNueva) {
        LocalDate fechaActual = LocalDate.now();
        if (fechaFinNueva.isBefore(fechaActual)) {
            throw new UnsupportedOperationException("La fecha fin debe ser mayor a la actual");
        }
        if (this.fechaFin != null && this.fechaFin.isAfter(LocalDate.now()) ) {
            // revisar si esto es correcto aca o no
            throw new UnsupportedOperationException("La inscripción fue programada previamente para finalizarce en una fecha futura.");
        }
        if (fechaFinNueva.isEqual(fechaActual)) {
            this.finalizar();
            // ver como hacer para que corte aca en este caso como un break
        }
        this.fechaFin = fechaFinNueva;
    }

    public Cuota obtenerCuotaConEsteId(Long idCuota) {
        return cuotas.stream()
                .filter(c -> c.tieneEsteId(idCuota))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementFoundException("No se encontró cuota para esa inscripcion"));
    }

    // SECCION ES DE

    public boolean esDeEsteServicio(Servicio servicio) {
        return (servicio.tieneEsteGrupo(this.grupo));
    }

    public boolean esDeEsteGrupo(Grupo grupo) {
        return (this.grupo == grupo);
    }

    public boolean esDeEsteAlumno(Alumno alumno) {
        return (this.alumno == alumno);
    }


    // SECCION DE ESTADOS

    // Vigente es tanto aceptada como en curso
    public boolean estaVigente() {
        return (estaAceptada() || estaEnCurso());
    }

    public boolean estaAceptada() {
        return (this.estado == EstadoInscripcion.Aceptada);
    }

    public boolean estaEnCurso() {
        return (this.estado == EstadoInscripcion.EnCurso);
    }

    public boolean estaPendiente() {
        return (this.estado == EstadoInscripcion.PendienteAceptacion);
    }

    public boolean estaRechazada() {
        return (this.estado == EstadoInscripcion.Rechazada);
    }

    public boolean estaFinalizada() {
        return (this.estado == EstadoInscripcion.Finalizada);
    }

    public boolean esDeEsteAnio(int anio) {
        return ( this.fechaInicio.getYear() == anio );
    }


    // SECCION RESUMEN PAGOS

    public Integer contarCuotas() {
        return this.getCuotas().size();
    }

    public Integer contarVencimientos() {
        return this.obtenerCuotasVencidas().size();
    }

    public Integer contarPagos() {
        return this.obtenerCuotasAbonadas().size();
    }

    public double calcularDemoraPromedioPagos() {
        List<Cuota> cuotasAbonadas = this.obtenerCuotasAbonadas();

        int cantTotalCuotas = this.contarCuotas();
        if (cantTotalCuotas == 0) return 0.0;

        long acumDiferenciaFechas = 0;

        for (Cuota cuotaAbonada : cuotasAbonadas) {
            LocalDate fechaInicioCiclo = cuotaAbonada.getFechaInicioCiclo();
            LocalDate fechaPago = cuotaAbonada.getPago().getFechaPago();

            if (fechaPago.isAfter(fechaInicioCiclo)) {
                long diferenciaFechas = ChronoUnit.DAYS.between(fechaInicioCiclo, fechaPago);
                acumDiferenciaFechas += diferenciaFechas;
            }
        }

        double promedioDemoraPagos = (double) acumDiferenciaFechas / cantTotalCuotas;
        return promedioDemoraPagos;
    }

    // Calcula la demora promedio de pagos de la inscripcion pero usando las cuotas que tienen su ciclo en esa fecha
    public double calcularDemoraPromedioPagosEn(LocalDate fecha) {
        List<Cuota> cuotasAbonadas = this.obtenerCuotasAbonadasConCicloEn(fecha);
        List<Cuota> totalCuotasEnFecha = this.obtenerCuotasConCicloEn(fecha);
        int cantTotalCuotas = totalCuotasEnFecha.size();
        if (cantTotalCuotas == 0) return 0.0;

        long acumDiferenciaFechas = 0;

        for (Cuota cuotaAbonada : cuotasAbonadas) {
            LocalDate fechaInicioCiclo = cuotaAbonada.getFechaInicioCiclo();
            LocalDate fechaPago = cuotaAbonada.getPago().getFechaPago();

            if (fechaPago.isAfter(fechaInicioCiclo)) {
                long diferenciaFechas = ChronoUnit.DAYS.between(fechaInicioCiclo, fechaPago);
                acumDiferenciaFechas += diferenciaFechas;
            }
        }

        double promedioDemoraPagos = (double) acumDiferenciaFechas / cantTotalCuotas;
        return promedioDemoraPagos;
    }

    public double calcularDemoraPromedioPagosEn(Month month, Year year) {
        List<Cuota> cuotasAbonadas = this.obtenerCuotasAbonadasConCicloEn(month, year);
        List<Cuota> totalCuotasEnFecha = this.obtenerCuotasConCicloEn(month, year);
        int cantTotalCuotas = totalCuotasEnFecha.size();
        if (cantTotalCuotas == 0) return 0.0;

        long acumDiferenciaFechas = 0;

        for (Cuota cuotaAbonada : cuotasAbonadas) {
            LocalDate fechaInicioCiclo = cuotaAbonada.getFechaInicioCiclo();
            LocalDate fechaPago = cuotaAbonada.getPago().getFechaPago();

            if (fechaPago.isAfter(fechaInicioCiclo)) {
                long diferenciaFechas = ChronoUnit.DAYS.between(fechaInicioCiclo, fechaPago);
                acumDiferenciaFechas += diferenciaFechas;
            }
        }

        double promedioDemoraPagos = (double) acumDiferenciaFechas / cantTotalCuotas;
        return promedioDemoraPagos;
    }

    public double calcularPorcentajeVencimientos() {
        int cantCuotas = this.contarCuotas(); // 100%
        int cantVencimientos = this.contarVencimientos(); // ? %

        if (cantCuotas == 0) return 0.0; // Evitar división por cero

        double procentajeVencimientos = cantVencimientos * (100.0) / cantCuotas;
        return procentajeVencimientos;
    }

    // Calculamos el porcentaje de vencimientos solo con las cuotas que tienen su ciclo en esa fecha
    public double calcularPorcentajeVencimientosEn(LocalDate fecha) {
        List<Cuota> cuotasVencidas = this.obtenerCuotasVencidasConCicloEn(fecha);
        List<Cuota> totalCuotasEnFecha = this.obtenerCuotasConCicloEn(fecha);

        int cantTotalCuotas = totalCuotasEnFecha.size(); // 100%
        int cantVencimientos = cuotasVencidas.size(); // ? %

        if (cantTotalCuotas == 0) return 0.0; // Evitar división por cero

        double procentajeVencimientos = cantVencimientos * (100.0) / cantTotalCuotas;
        return procentajeVencimientos;
    }

    public double calcularPorcentajeVencimientosEn(Month month, Year year) {
        List<Cuota> cuotasVencidas = this.obtenerCuotasVencidasConCicloEn(month, year);
        List<Cuota> totalCuotasEnFecha = this.obtenerCuotasConCicloEn(month, year);

        int cantTotalCuotas = totalCuotasEnFecha.size(); // 100%
        int cantVencimientos = cuotasVencidas.size(); // ? %

        if (cantTotalCuotas == 0) return 0.0; // Evitar división por cero

        double procentajeVencimientos = cantVencimientos * (100.0) / cantTotalCuotas;
        return procentajeVencimientos;
    }

    public Integer contarPagosEfectivo() {
        return this.obtenerCuotasAbonadas().stream().map(Cuota::esPagadaEnEfectivo).toList().size();
    }

    public Integer contarPagosConMercadoPago() {
        return this.obtenerCuotasAbonadas().stream().map(Cuota::esPagadaConMercadoPago).toList().size();
    }

    public Integer contarPagosConTransferencia() {
        return this.obtenerCuotasAbonadas().stream().map(Cuota::esPagadaConMercadoPago).toList().size();
    }

    public Integer contarPagosCon(String metodoPago) {
        return this.obtenerCuotasAbonadas().stream().map(cuota -> cuota.esPagadaCon(metodoPago)).toList().size();
    }

    public double calcularPorcentajePagosCon(String metodoPago) {
        int cantPagos = this.contarPagos(); // 100%
        int cantPagosCon = this.contarPagosCon(metodoPago); // ?%

        if (cantPagos == 0) return 0.0;

        double porcentajePagosCon = cantPagosCon * 100.0 / cantPagos;
        return porcentajePagosCon;
    }

    public boolean esVigenteEn(LocalDate fechaVigencia) {
        // Esto me sirve para saber si un alumno es vigente en esa fecha, seria la fechaFinVigencia, la limite
        // No me sirve para calcular los NUEVOS ALUMNOS en un periodo

        // si tiene fecha inicio en null todavia no fue o es vigente
        if (this.fechaInicio == null) {
            return false;
        }
        // Es vigente en esa fecha si la fecha inicio es antes o igual a la fecha vigencia
        // Y la fecha fin o es null, o es mayor a la fecha vigencia
        if (fechaVigencia.isAfter(this.fechaInicio)) {
            if (this.fechaFin == null) {
                return true;
            } else if (this.fechaFin.isAfter(fechaVigencia)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // la fechaInicio de la inscripcion es anterior igual o despues de la fechaInicioVigencia (osea no importa?)
    // pero la fechaInicio de la inscripcion es antes de la fechaFinVigencia
    // y ademas la fechaFin de la inscripcion es null o despues de la fechaFinVigencia
    // osea que al fin y al cabo la fechaInicioVigencia no importa?

//    public boolean esNuevaInscripcionVigenteEn(LocalDate fechaInicioVigencia, LocalDate fechaFinVigencia) {
//        // Esto me sirve para ver las inscripciones que durante esas fechas comenzaron a ser vigentes
//
//        // si tiene fecha inicio en null todavia no fue o es vigente
//        if (this.fechaInicio == null) {
//            return false;
//        }
//        // Es nueva inscricpion vigente en si la fecha inicio esta entre las fechas de vigencia
//        // Y si la fecha fin termina dentro de esas fechas igual fue una nueva inscripcion vigente en esas fechas
//
//        if (this.fechaInicio.isAfter(fechaInicioVigencia) || this.fechaInicio.isEqual(fechaInicioVigencia)) {
//            return true;
//        } else {
//            return false;
//        }
//    }

    // si digo es vigente en ayer
    // me da las que son vigentes ayer
    // si quiero las que fueron vigentes hasta ayer? que deberia comparar?
    // deberia ver que la fecha inicio sea anterior a ayer, la fecha fin no importa
    // y si quiero saber las que fueron vigentes durante todo un periodo
    // le paso un mes y tengo que ver que la fecha inicio sea anterior a la fecha inicio y la fecha fin posteriror a la fecha fin


    public boolean esSolicitadaEn(Integer day, Month month, Year year) {
        if (day != null && month != null && year != null) {
            LocalDate fechaArmada = LocalDate.of(year.getValue(), month, day);
            return this.fechaSolicitud.isEqual(fechaArmada);
        } else if (day == null && month != null && year != null) {
            return this.fechaSolicitud.getYear() == year.getValue() && this.fechaSolicitud.getMonth().equals(month);
        } else if (day == null && month == null && year != null) {
            return this.fechaSolicitud.getYear() == year.getValue();
        } else if (day == null && month != null && year == null) {
            return this.fechaSolicitud.getMonth().equals(month) && this.fechaSolicitud.getYear() == LocalDate.now().getYear();
        } else {
            return false;
        }
    }

 }
