import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import CuotaCard from "../../Alumno/ResumenCuota"; // Ajusta la ruta según corresponda
import { useNavigate, useParams } from "react-router-dom";

const CuotasInscripcion = ({ cuotas, inscripcion, resumenPagos }) => {
    const navigate = useNavigate();
    const {idInstructor} = useParams();

    return (
        <Card
            className="shadow-lg p-4 mb-4"
            style={{ position: "relative", fontFamily: "Roboto" }}
        >
            <Card.Body>
                <Button
                    variant="primary"
                    onClick={() => navigate(`/instructor/${idInstructor}/servicio/${inscripcion.servicio.id}/cobros?alumno=${inscripcion.id}`)}
                    style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        backgroundColor: "#6a5acd", // Color violeta que estás usando
                        borderColor: "#6a5acd",
                    }}
                >
                    Cuotas
                </Button>
                <Card.Title as="h3" style={{ color: "#6a5acd" }}>Pagos</Card.Title>
                <hr />
                {/* Primera fila: Estadísticas */}
                <Row className="mb-4">
                    {/* Columna 1: Demora Promedio de Pagos */}
                    <Col md={4}>
                        <h4
                            style={{
                                fontWeight: "bold",
                                color: " #483D8B",
                                marginBottom: "10px",
                            }}
                        >
                            Demora promedio
                        </h4>
                        <p
                            style={{
                                fontSize: "2.3rem",
                                fontWeight: "bold",
                                color: " #483D8B",
                                margin: 0,
                            }}
                        >
                            {resumenPagos?.demoraPromedio} días
                        </p>
                    </Col>
                    {/* Columna 2: Demora Promedio de Pagos */}
                    <Col md={4}>
                        <h4
                            style={{
                                fontWeight: "bold",
                                color: " #483D8B",
                                marginBottom: "10px",
                            }}
                        >
                            Vencimientos
                        </h4>
                        <p
                            style={{
                                fontSize: "2.3rem",
                                fontWeight: "bold",
                                color: "  #483D8B",
                                margin: 0,
                            }}
                        >
                            {resumenPagos?.porcentajeVencimientos}%
                        </p>
                    </Col>
                    {/* Columna 3: Estado de Cuotas */}
                    <Col md={4}>
                        <p style={{ fontSize: "1rem", margin: "0" }}>
                            <strong>Pagos:</strong> {resumenPagos?.cantCuotasPagadas}
                        </p>
                        <p style={{ fontSize: "1rem", margin: "0" }}>
                            <strong>Vencimientos:</strong> {resumenPagos?.cantVencimientos}
                        </p>
                        <p style={{ fontSize: "1rem", margin: "0" }}>
                            <strong>Total Cuotas:</strong> {resumenPagos?.cantCuotas}
                        </p>
                    </Col>
                </Row>
                <hr />
                {/* Segunda fila: Últimas Cuotas */}

                <Row
                    className="flex-nowrap"
                    style={{ overflowX: "auto", paddingBottom: "10px" }}
                >
                    <Col md={3} className="d-flex align-items-center justify-content-center" style={{ textAlign: "center" }}>
                        <h4 style={{ fontWeight: "bold", color: "#6a5acd", margin: 0 }}>
                            Últimas Cuotas
                        </h4>
                    </Col>
                    {cuotas.map((cuota) => (
                        <Col key={cuota.id} xs="auto" className="me-2">
                            <CuotaCard
                                cuota={cuota}
                                idInscripcion={inscripcion.id}
                                idServicio={inscripcion.servicio.id}
                                grupo={inscripcion.grupo}
                                sePuedePagar={false}
                            />
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );
};

export default CuotasInscripcion;
