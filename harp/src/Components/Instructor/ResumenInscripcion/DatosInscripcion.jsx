import React from "react";
import { Row, Col, ListGroup, Button, Image, Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import { FaCalendarAlt } from "react-icons/fa"; // Ícono de calendario
import { calcularEdad } from "../MiServicio/MenuOpciones/Dashboard/Inscripciones";

const calcularDiferenciaDeFechas = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return "Fecha no disponible";
    return formatDistance(new Date(fechaInicio), new Date(fechaFin), { locale: es });
};

const InscripcionData = ({ inscripcionData }) => {
    const navigate = useNavigate();
    const {idInstructor} = useParams();
    const { alumno, grupo, fechaSolicitud, fechaAceptacion, fechaFin } = inscripcionData;

    return (
        <div className="card shadow-lg p-4 mb-4 position-relative">
            <h3 style={{ color: "#6a5acd" }}>Inscripción</h3>
            <hr />

            {/* Sección Alumno */}
            <Row className="mb-3 align-items-center">
                <h5 className="text-primary">Alumno</h5>

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
            <Row className="mb-2">
                <Col>
                    <h5 className="text-primary mb-2">Grupo: {grupo.nombre}</h5>

                    {grupo.horarios.map((horario, index) => (
                        <Card key={index} className="mb-1 p-1 shadow-sm">
                            <Row className="align-items-center">
                                {/* Día de la semana */}
                                <Col xs={4} className="fw-bold text-center fs-6">
                                    {horario.diaSemana.nombre}
                                </Col>
                                {/* Horarios en una fila más compacta */}
                                <Col xs={8} className="d-flex justify-content-around text-center">
                                    <div className="fw-bold ">{horario.horaInicio}</div>
                                    <div className="fw-bold ">{horario.horaFin}</div>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Col>
            </Row>


            <hr />

            {/* Sección Fechas */}
            <Row>
                <Col>
                    <h5 className="text-primary">Fechas</h5>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <strong>Inscripto hace:</strong> {calcularDiferenciaDeFechas(fechaSolicitud, new Date())}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Solicitud aceptada:</strong> {calcularDiferenciaDeFechas(fechaSolicitud, fechaAceptacion)} después
                        </ListGroup.Item>
                        {fechaFin && (
                            <ListGroup.Item>
                                <strong>Solicitud finalizada:</strong> {calcularDiferenciaDeFechas(fechaSolicitud, fechaFin)} después
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>
            </Row>
        </div >
    );
};

export default InscripcionData;
