import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Alert } from "react-bootstrap";
import { FaCog } from "react-icons/fa";
import { getMontoActualGrupoDeHistorial, getMontoProgramadoDeHistorial } from "../../../../services/HistorialMontoCuota";

const GrupoHorariosMontos = ({ grupo, cuposLibres, handleEditClick, ordenarPorDia, getPrecioYFrecuencia }) => {
    const [montoProgramado, setMontoProgramado] = useState(null);
    const [montoActual, setMontoActual] = useState(null);

    const fechaInicio = montoProgramado?.fechaInicio ? new Date(montoProgramado.fechaInicio + "T00:00:00") : null;
    const esFechaValida = fechaInicio ? fechaInicio <= new Date() : true;
    const sePuedeEditar = !fechaInicio || esFechaValida;

    useEffect(() => {
        const obtenerProgramado = async () => {
            try {
                const resultado = await getMontoProgramadoDeHistorial(grupo.historialMontos);
                setMontoProgramado(resultado);
                const resultado2 = await getMontoActualGrupoDeHistorial(grupo.historialMontos);
                setMontoActual(resultado2);
            } catch (error) {
                console.error("Error al traer el monto progrmado:", error);
            }
        };
        obtenerProgramado();
    }, [grupo]);


    return (
        <Card className="h-100">
            <Card.Body>
                {/* Título y cupos */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                    <Card.Title className="text-start mb-2 mb-md-0">{grupo.nombre}</Card.Title>
                    <span className="text-muted small">{cuposLibres[grupo.id] || "Cargando cupos..."}</span>
                </div>

                {/* Botón de configuración */}
                <Button
                    variant="light"
                    className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute"
                    onClick={() => handleEditClick(grupo)}
                    style={{ backgroundColor: "#1E1B4B", border: "none", top: "10px", right: "10px" }}
                >
                    <FaCog color="white" size={10} />
                </Button>

                {/* Horarios */}
                {ordenarPorDia(grupo.horarios).map((horario) => (
                    <Card.Text key={horario.id}>
                        {horario.diaSemana.nombre} de {horario.horaInicio.slice(0, 5)} a {horario.horaFin.slice(0, 5)}
                    </Card.Text>
                ))}

                {/* Precio y frecuencia */}
                <Card.Text className="fw-bold mt-2">{getPrecioYFrecuencia(grupo?.historialMontos)}</Card.Text>
            </Card.Body>

            {/* Sección de montos */}
            <Row>
                {/* Actual */}
                <Col md={6} sm={12} className="p-3">
                    <h5 className="fw-bold text-center">Actual</h5>
                    <Card>
                        <Card.Body>
                            {montoProgramado ? (
                                <div className="mb-2">
                                    <p>
                                        <strong>Monto:</strong> ${montoProgramado.monto}
                                        <button
                                            className="btn btn-outline-secondary ms-2"
                                            disabled={!sePuedeEditar}
                                        >
                                            ✏️
                                        </button>
                                    </p>
                                    <p>
                                        <strong>Vigente desde:</strong> {fechaInicio ? fechaInicio.toLocaleDateString() : "No definida"}
                                    </p>
                                    <hr />
                                </div>
                            ) : (
                                <p>No hay monto definido.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Programados */}
                <Col md={6} sm={12} className="p-3">
                    <h5 className="fw-bold text-center">Programados</h5>
                    <Card className="h-100">
                        <Card.Body>
                            {grupo.historialMontos.length > 1 ? (
                                <div key={grupo.id} className="mb-2">
                                    <p>
                                        <strong>Monto:</strong> ${montoProgramado.monto}
                                        {esFechaFutura && (
                                            <button className="btn btn-outline-secondary ms-2">
                                                ✏️
                                            </button>
                                        )}
                                    </p>
                                    <p>
                                        <strong>Vigente desde:</strong> {fechaInicio.toLocaleDateString()}
                                    </p>
                                </div>

                            ) : (
                                <Alert variant="warning">
                                    <span>No hay cambios en los montos configurados.</span>
                                    <Button
                                        variant="primary"
                                        className="ms-2"
                                    >
                                        Configurar
                                    </Button>
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default GrupoHorariosMontos;
