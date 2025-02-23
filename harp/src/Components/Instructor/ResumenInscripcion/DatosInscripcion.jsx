import React from "react";
import { Row, Col, ListGroup, Button, Image, Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format, formatDistance, isEqual, isSameDay, parse, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { FaCalendarAlt } from "react-icons/fa"; // Ícono de calendario
import { calcularEdad } from "../MiServicio/MenuOpciones/Dashboard/Inscripciones";

const calcularDiferenciaDeFechas = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return "Fecha no disponible";
    return formatDistance(new Date(fechaInicio), new Date(fechaFin), { locale: es });
};

const calcularFechasIgualAHoy = (fecha) => {
    const fechaLocal = parse(fecha, "yyyy-MM-dd", new Date());
    return isSameDay(fechaLocal, new Date());
};

const InscripcionData = ({ inscripcionData }) => {
    const navigate = useNavigate();
    const { idInstructor } = useParams();
    const { alumno, grupo, fechaSolicitud, fechaAceptacion, fechaFin, fechaInicio } = inscripcionData;

    return (
        <div className="card shadow-lg p-4 mb-4 position-relative">
            <Row className="align-items-center">
                <Col xs="auto"> {/* El ancho se ajusta al contenido */}
                    <h3 style={{ color: "#6a5acd", marginBottom: 0 }}>Inscripción</h3>
                </Col>
                <Col xs="auto" className="ms-2"> {/* Margen a la izquierda para separar */}
                    <span
                        className={`badge bg-${inscripcionData.estado === "PendienteAceptacion"
                            ? "warning"
                            : inscripcionData.estado === "EnCurso" || inscripcionData.estado === "Aceptada"
                                ? "success"
                                : inscripcionData.estado === "Anulada" || inscripcionData.estado === "Finalizada"
                                    ? "danger"
                                    : "secondary"
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

                <Col xs={12} className="text-center">
                    <Row className="align-items-center">
                        {/* Foto de perfil */}
                        <Col xs={3} className="text-center">
                            <Image
                                src={alumno.usuario.fotoPerfilURL}
                                roundedCircle
                                style={{ width: "90px", height: "90px", objectFit: "cover" }}
                            />
                        </Col>

                        {/* Datos del alumno */}
                        <Col xs={9} className="text-start">
                            <Link
                                to={`/instructor/${idInstructor}/alumnos/${alumno?.usuario?.nombreUsuario}`}

                                className="text-primary text-decoration-none fw-bold"
                            >
                                <h4 className="fw-bold text-dark mb-1">{alumno.nombreCompleto}</h4>
                            </Link>
                            <p className="text-muted mb-1">{calcularEdad(alumno.usuario.fechaNacimiento)} años</p>
                            <p className="mb-1">{alumno.usuario.email}</p>
                        </Col>
                    </Row>
                </Col>
            </Row>


            <hr />

            {/* Sección Grupo */}
            <Row className="mb-2 align-items-center">
                {/* Columna para el nombre del servicio (1/3 del ancho) */}
                <Col xs={4} className="fw-bold text-center fs-5">
                    <h5 className="fw-bolder">{inscripcionData.servicio.nombre}</h5>
                </Col>

                {/* Columna para el grupo y sus horarios (2/3 del ancho) */}
                <Col xs={8}>
                    <h5>
                        <span style={{ color: "#6a5acd" }}>Grupo: </span>
                        <span>{grupo.nombre}</span>
                    </h5>

                    {grupo.horarios.map((horario, index) => (
                        <Card key={index} className="mb-1 p-1 shadow-sm">
                            <Row className="align-items-center">
                                {/* Día de la semana */}
                                <Col xs={4} className="fw-bold text-center fs-6">
                                    {horario.diaSemana.nombre}
                                </Col>
                                {/* Horarios en una fila más compacta */}
                                <Col xs={8} className="d-flex justify-content-around text-center">
                                    <div className="fw-bold">{horario.horaInicio}</div>
                                    <div className="fw-bold">{horario.horaFin}</div>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Col>
            </Row>


            <hr />

            {inscripcionData.estado !== "PendienteAceptacion" && (
                <Row>
                    <Col>
                        <h5 className="text-primary">Fechas</h5>
                        <ListGroup variant="flush">
                            {fechaFin === null
                                ? calcularFechasIgualAHoy(fechaAceptacion)
                                    ? <ListGroup.Item><strong>Inscripto desde:</strong> Hoy</ListGroup.Item>
                                    : <ListGroup.Item><strong>Inscripto hace:</strong> {calcularDiferenciaDeFechas(fechaAceptacion, new Date())}</ListGroup.Item>
                                : <ListGroup.Item><strong>Inicio:</strong> {inscripcionData.fechaInicio}</ListGroup.Item>
                            }

                            {fechaInicio !== fechaAceptacion && (
                                <ListGroup.Item>
                                    <strong>Inicio de actividad:</strong> {fechaInicio}
                                </ListGroup.Item>
                            )}

                            {fechaAceptacion && (
                                <ListGroup.Item>
                                    <strong>Solicitud aceptada:</strong> {calcularDiferenciaDeFechas(fechaSolicitud, fechaAceptacion)} después
                                </ListGroup.Item>
                            )}

                            {fechaFin && inscripcionData.estado === "Finalizada" ? (
                                <>
                                    <ListGroup.Item>
                                        <strong>Duración:</strong> {calcularDiferenciaDeFechas(fechaSolicitud, fechaFin)}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Inscripción finalizada:</strong> Hace {calcularDiferenciaDeFechas(fechaFin, new Date())}
                                    </ListGroup.Item>
                                </>
                            ) : (
                                <ListGroup.Item>
                                    <strong>Finalizará el:</strong> {fechaFin}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Col>
                </Row>
            )}

        </div >
    );
};

export default InscripcionData;
