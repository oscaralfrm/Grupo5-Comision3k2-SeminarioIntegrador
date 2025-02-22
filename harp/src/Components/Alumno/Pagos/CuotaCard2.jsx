import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";

const CuotaCard = ({ cuota }) => {
    const {
        inscripcion,
        estadoCuota,
        fechaLimitePago,
        montoServicio,
        fechaPago,
        metodoPago,
        fechaInicioCiclo,
        fechaFinCiclo,
    } = cuota;

    const hoy = new Date();
    const fechaLimite = new Date(fechaLimitePago);

    let paymentInfo = "";
    if (fechaPago) {
        paymentInfo = `Fecha pago: ${new Date(fechaPago).toLocaleDateString()}`;
    } else if (hoy < fechaLimite) {
        paymentInfo = `Límite pago: ${fechaLimite.toLocaleDateString()}`;
    } else {
        paymentInfo = "Vencida";
    }

    const logoUrl = inscripcion.servicio.logoURL;

    const instructorPhotoUrl =
        inscripcion.instructor?.fotoURL ||
        "https://via.placeholder.com/40?text=No+Pic";
    const instructorName =
        inscripcion.instructor?.nombre || "Nombre Instructor";
    const servicioNombre = inscripcion.servicio.nombre || "Servicio";

    return (
        <Card
            className="shadow mb-3"
            style={{
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #1E1B4B, rgb(27, 59, 106))",
                color: "#EAEAEA",
                fontFamily: "'Roboto', sans-serif",
                padding: "12px", // Padding de la card
            }}
        >
            <Card.Body>
                {/* Fila 1: Solo foto y nombre del instructor */}
                <Row className="mb-3 align-items-center">
                    <Col xs={12} className="d-flex align-items-center">
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                background: "#fff",
                                marginRight: "8px",
                            }}
                        >
                            <img
                                src={instructorPhotoUrl}
                                alt={instructorName}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <span style={{ fontSize: "16px", fontWeight: "500" }}>
                            {instructorName}
                        </span>
                    </Col>
                </Row>

                {/* Fila 2: Contenedor de la imagen y datos */}
                <Row className="align-items-stretch" style={{ height: "160px", overflow: "hidden" }}>
                    <Col xs={12} md={4} className="d-flex">
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "100%", // Asegura que ocupe todo el espacio
                                overflow: "hidden",
                                borderRadius: "6px",
                                backgroundColor: "#2E2B5B", // Fondo visible si la imagen falla
                            }}
                        >
                            {/* Contenedor de imagen con tamaño controlado */}
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {/* Imagen principal */}
                                <img
                                    src={logoUrl}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        position: "absolute",
                                        filter: "blur(1px) brightness(0.9)", // Ajustado para mejor visibilidad
                                    }}
                                />

                                {/* Texto superpuesto */}
                                <div
                                    style={{
                                        position: "relative", // Key Fix: Evita que herede el filtro
                                        zIndex: 1,
                                        color: "#fff",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        textShadow: "0 0 5px rgba(0,0,0,0.5)",
                                        pointerEvents: "none", // Permite clicks a través del texto
                                    }}
                                >
                                    {servicioNombre}
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Columna 2: Datos (ciclo, fecha límite, estado, total y botón) */}
                    <Col xs={12} md={8} className="d-flex flex-column h-100">
                        <div style={{ flex: 1 }}>
                            <div style={{ flex: 1 }}>
                                <Card.Text style={{ fontSize: "14px", color: "#C0C8E0" }}>
                                    <strong>Ciclo:</strong>{" "}
                                    {new Date(fechaInicioCiclo).toLocaleDateString()} -{" "}
                                    {new Date(fechaFinCiclo).toLocaleDateString()}
                                </Card.Text>
                                <Card.Text style={{ fontSize: "14px", color: "#C0C8E0" }}>
                                    <strong>Fecha límite:</strong> {fechaLimite.toLocaleDateString()}
                                </Card.Text>
                                <Card.Text
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: estadoCuota === "Pendiente" ? "#FFD700" : "#8AFF8A",
                                    }}
                                >
                                    {paymentInfo}
                                </Card.Text>
                            </div>
                            <Row className="mt-auto">
                                <Col xs={6}>
                                    <h2 className="fw-bold m-0">
                                        ${montoServicio.monto.toLocaleString()}
                                    </h2>
                                </Col>
                                <Col xs={6} className="text-end">
                                    <Button
                                        style={{
                                            borderRadius: "24px",
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            background: "#FFFFFF",
                                            color: "rgb(28, 36, 61)",
                                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                                            padding: "8px 16px",
                                            width: "100%",
                                            maxWidth: "140px",
                                        }}
                                        disabled={estadoCuota !== "Pendiente"}
                                    >
                                        {estadoCuota === "Pendiente" ? "Pagar" : "Abonada"}
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

            </Card.Body>
        </Card>
    );
};

export default CuotaCard;