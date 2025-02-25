import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, Button, Image, Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDistance, isSameDay, parse } from "date-fns";
import { es } from "date-fns/locale";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { calcularAntiguedadComoTexto, calcularEdad } from "../MiServicio/MenuOpciones/Dashboard/Inscripciones";
import { getAlumnosDeGrupo, getInscripcionesVigentesDeAlumno } from "../../../services/Alumno";
import { armarStringFrecuenciaCobro } from "../../../services/frecuenciaPago";
import { getMontoActualGrupoDeHistorial } from "../../../services/HistorialMontoCuota";
import { aceptarInscripcion, rechazarInscripcion } from "../../../services/Inscripcion";
import EnrollmentModal from "../MiServicio/MenuOpciones/Dashboard/ModalAceptarRechazarInscripcion";
import SuccessModal from "../../CartelDeExito/CartelDeExito";
import profileImg from "../../../assets/profile.png"

// Función para calcular la diferencia de fechas en formato legible
const calcularDiferenciaDeFechas = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return "Fecha no disponible";
    return formatDistance(new Date(fechaInicio), new Date(fechaFin), { locale: es });
};

const calcularCuposLibres = async (grupo, idServicio) => {
    if (grupo.cantMaxAlumnos === null) return "Con cupos libres";
    if (grupo.cantMaxAlumnos == 1) return "Único cupo libre"
    const alumnosInscritos = await getAlumnosDeGrupo(idServicio, grupo.id);
    const cuposLibres = grupo.cantMaxAlumnos - alumnosInscritos.length;
    return cuposLibres > 0
        ? cuposLibres == 1
            ? "Último cupo libre"
            : `${cuposLibres} cupos libres`
        : "Sin cupos libres";
};

// Función para verificar si la fecha es igual a hoy
const calcularFechasIgualAHoy = (fecha) => {
    const fechaLocal = parse(fecha, "yyyy-MM-dd", new Date());
    return isSameDay(fechaLocal, new Date());
};

const SolicitudInscripcionData = ({ inscripcionData, fetchSolicitudes }) => {
    const navigate = useNavigate();
    const { idInstructor } = useParams();
    const { alumno, grupo, fechaSolicitud, servicio, fechaFin, estado, fechaAceptacion, fechaInicio } = inscripcionData;
    const [cuposLibres, setCuposLibres] = useState();
    const [cantInscripciones, setCantInscripciones] = useState();

    // Estados para el modal de aceptación/rechazo y modal de éxito
    const [modalType, setModalType] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const cargarCuposLibres = async () => {
        const resultado = await calcularCuposLibres(grupo, servicio.id);
        setCuposLibres(resultado);
    };

    const cargarCantInscripciones = async () => {
        const inscripciones = await getInscripcionesVigentesDeAlumno(alumno.id);
        setCantInscripciones(inscripciones.length);
    };

    useEffect(() => {
        cargarCuposLibres();
        cargarCantInscripciones();
    }, [inscripcionData]);

    // Funciones para abrir el modal de aceptación o rechazo
    const handleAccept = () => {
        setModalType("accept");
        setShowModal(true);
    };

    const handleReject = () => {
        setModalType("reject");
        setShowModal(true);
    };

    // Función para manejar el envío desde el modal
    const handleModalSubmit = async (enrollment, inputValue) => {
        try {
            if (modalType === "accept") {
                // Se utiliza la id del servicio e id de inscripción de inscripcionData
                await aceptarInscripcion(servicio.id, enrollment.id, inputValue);
                setSuccessMessage("La inscripción ha sido aceptada exitosamente.");
            } else {
                console.log("motivo", inputValue);
                await rechazarInscripcion(servicio.id, inscripcionData.id, inputValue);
                setSuccessMessage("La inscripción ha sido rechazada exitosamente.");
            }
            setShowSuccessModal(true);
            setShowModal(false);
            fetchSolicitudes();
        } catch (error) {
            console.error("Error al enviar el modal:", error);
        }
    };

    return (
        <div className="card shadow-lg p-4 mb-4 position-relative" style={{ marginTop: "2rem" }}>
            {/* Cabecera: Título y Estado */}
            <Row className="align-items-center">
                <Col xs="auto">
                    {estado == "PendienteAceptacion" &&
                        (
                            calcularFechasIgualAHoy(fechaSolicitud) ? (
                                <h3 style={{ color: "#6a5acd", marginBottom: 0 }}>Solicitada hoy</h3>
                            ) : (
                                <h3 style={{ color: "#6a5acd", marginBottom: 0 }}>
                                    <span style={{ color: "#6a5acd" }}>Solicitada hace </span>
                                    {calcularDiferenciaDeFechas(new Date(), fechaSolicitud)}
                                </h3>
                            )
                        )
                    }

                    {estado == "Finalizada" &&
                        (
                            calcularFechasIgualAHoy(fechaFin) ? (
                                <h3 style={{ color: "#6a5acd", marginBottom: 0 }}>Finalizada hoy</h3>
                            ) : (
                                <h3 style={{ color: "#6a5acd", marginBottom: 0 }}>
                                    <span style={{ color: "#6a5acd" }}>Finalizada hace </span>
                                    {calcularDiferenciaDeFechas(new Date(), fechaFin)}
                                </h3>
                            )
                        )
                    }
                    {estado == "Aceptada" &&
                    (
                        calcularFechasIgualAHoy(fechaAceptacion) ? (
                            <h3 style={{ color: "#6a5acd", marginBottom: 0 }}>Aceptada hoy</h3>
                        ) : (
                            <h3 style={{ color: "#6a5acd", marginBottom: 0 }}>
                                <span style={{ color: "#6a5acd" }}>Aceptada hace </span>
                                {calcularDiferenciaDeFechas(new Date(), fechaAceptacion)}
                            </h3>
                        )
                    )
                    }
                    {estado == "EnCurso" &&
                    (
                        calcularFechasIgualAHoy(fechaInicio) ? (
                            <h3 style={{ color: "#6a5acd", marginBottom: 0 }}>Iniciada hoy</h3>
                        ) : (
                            <h3 style={{ color: "#6a5acd", marginBottom: 0 }}>
                                <span style={{ color: "#6a5acd" }}>Iniciada hace </span>
                                {calcularDiferenciaDeFechas(new Date(), fechaInicio)}
                            </h3>
                        )
                    )
                    }
                    {estado == "Rechazada" && fechaFin &&
                    (
                        calcularFechasIgualAHoy(fechaFin) ? (
                            <h3 style={{ color: "#6a5acd", marginBottom: 0 }}>Rechazada hoy</h3>
                        ) : (
                            <h3 style={{ color: "#6a5acd", marginBottom: 0 }}>
                                <span style={{ color: "#6a5acd" }}>Rechazada hace </span>
                                {calcularDiferenciaDeFechas(new Date(), fechaFin)}
                            </h3>
                        )
                    )
                    }
                </Col>
                <Col xs />
                <Col xs="auto">
                    <span style={{ fontSize: "1.0rem" }}
                        className={`badge bg-${inscripcionData.estado === "PendienteAceptacion"
                            ? "warning"
                            : inscripcionData.estado === "EnCurso" || inscripcionData.estado === "Aceptada"
                                ? "success"
                                : "danger"
                            }`}
                    >
                        {inscripcionData.estado}
                    </span>
                </Col>
            </Row>
            <hr />

            {/* Sección Alumno */}
            <Row className="mb-3 align-items-center">
                <h5 style={{ color: "#6a5acd" }}>Alumno</h5>
                <Col xs={12}>
                    <Row className="align-items-center">
                        {/* Primera columna: Foto + Nombre + Edad */}
                        <Col xs={12} md={6} className="d-flex align-items-center">
                            <Image
                                src={alumno.usuario.fotoPerfilURL || profileImg}
                                roundedCircle
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    marginRight: "30px",
                                    marginLeft: "10px"
                                }}
                            />
                            <div>
                                <Link
                                    to={`/instructor/${idInstructor}/alumnos/${alumno?.usuario?.nombreUsuario}`}
                                    className="text-primary text-decoration-none fw-bold"
                                >
                                    <h4 className="fw-bold text-dark mb-1">{alumno.nombreCompleto}</h4>
                                </Link>
                                <p className="text-muted mb-0">{calcularEdad(alumno.usuario.fechaNacimiento)} años</p>
                            </div>
                        </Col>

                        {/* Segunda columna: Antigüedad y cantidad de inscripciones */}
                        <Col xs={12} md={6} className="text-start">
                            <ListGroup variant="flush">
                                <ListGroup.Item style={{ fontSize: "1rem" }}>
                                    <strong>Antigüedad en la app: </strong>
                                    {calcularAntiguedadComoTexto(alumno.usuario.fechaRegistro) || "No especificado"}
                                </ListGroup.Item>
                                <ListGroup.Item style={{ fontSize: "1rem" }}>
                                    <strong>Inscripto en: </strong>
                                    {cantInscripciones ? (cantInscripciones + " servicios") : "Ningún servicio"}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <hr />

            {/* Sección Unificada: Servicio */}
            <Row className="mb-2 align-items-center">
                <h5 style={{ color: "#6a5acd" }}>Servicio</h5>
                {/* Columna Izquierda: Logo, Servicio, Grupo y Horarios */}
                <Col xs={12} md={6}>
                    <div className="d-flex align-items-center mb-2">
                        <Image
                            src={servicio.logoURL || "/assets/placeholderForServices.png"}
                            roundedCircle
                            style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                marginRight: "10px"
                            }}
                        />
                        <div>
                            <Link
                                to={`/instructor/${idInstructor}/servicio/${servicio.id}/configurar`}
                                className="text-primary text-decoration-none fw-bold"
                            >
                                <h4 className="fw-bold text-dark mb-1">{servicio.nombre}</h4>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h5>
                            <span style={{ color: "#6a5acd" }}>Grupo </span> {grupo.nombre}
                        </h5>
                    </div>
                    {grupo.horarios.map((horario, index) => (
                        <Card key={index} className="mb-1 p-1 shadow-sm">
                            <Row className="align-items-center">
                                <Col xs={12} md={4} className="text-center" style={{ fontSize: "1.0rem", fontWeight: "bold" }}>
                                    {horario.diaSemana.nombre}
                                </Col>
                                <Col xs={12} md={8} className="d-flex justify-content-around text-center" style={{ fontSize: "1.0rem" }}>
                                    <div>{horario.horaInicio}</div>
                                    <div>{horario.horaFin}</div>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Col>
                {/* Columna Derecha: Modalidad, Precio y Cupos */}
                <Col xs={12} md={6}>
                    <ListGroup variant="flush">
                        <ListGroup.Item style={{ fontSize: "1rem" }}>
                            <strong>Clases: </strong>
                            {grupo.cantMaxAlumnos === 1 ? "Individuales" : "Grupales"}
                            {servicio.modalidadClases
                                ? servicio.modalidadClases === "Hibrida"
                                    ? " e "
                                    : " y "
                                : ""}
                            {servicio.modalidadClases === "Presencial"
                                ? "Presenciales"
                                : servicio.modalidadClases === "Virtual"
                                    ? "Virtuales"
                                    : servicio.modalidadClases === "Hibrida"
                                        ? "Híbridas"
                                        : ""}
                        </ListGroup.Item>
                        <ListGroup.Item style={{ fontSize: "1rem" }}>
                            <strong>Precio {armarStringFrecuenciaCobro(servicio.tipoFrecuenciaPago?.cantCiclo, servicio.tipoFrecuenciaPago?.unidadCiclo)}: </strong>
                            ${getMontoActualGrupoDeHistorial(grupo.historialMontos).monto}
                        </ListGroup.Item>
                        <ListGroup.Item style={{ fontSize: "1rem", fontWeight: "bold" }}>
                            <strong>Cupos: </strong>
                            {cuposLibres === "Último cupo libre" ? (
                                <span className="text-danger">{cuposLibres}</span>
                            ) : (
                                <span className="text-success">{cuposLibres}</span>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>

            <hr />

            {inscripcionData.estado == "PendienteAceptacion" &&
                <Row>
                    <Col>
                        <h5 className="text-primary">Acciones</h5>
                        <ListGroup horizontal>
                            <Button variant="success" className="me-2" onClick={handleAccept}>
                                <FaCheckCircle size={20} className="me-1" /> Aceptar
                            </Button>
                            <Button variant="danger" onClick={handleReject}>
                                <FaTimesCircle size={20} className="me-1" /> Rechazar
                            </Button>
                        </ListGroup>
                    </Col>
                </Row>
            }

            {/* Modal para aceptar/rechazar inscripción */}
            <EnrollmentModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                enrollment={inscripcionData}
                type={modalType}
            />

            {/* Modal de éxito */}
            <SuccessModal
                show={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={successMessage}
                message=""
            />
        </div>
    );
};

export default SolicitudInscripcionData;
