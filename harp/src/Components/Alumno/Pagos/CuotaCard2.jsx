import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Modal } from "react-bootstrap";
import placeholderImage from "../../../assets/placeholderForServices.png";
import * as servicioService from '../../../services/Servicio.js';

const CuotaCard = ({ cuota }) => {
    const {
        inscripcion,
        estadoCuota,
        fechaLimitePago,
        montoServicio,
        fechaPago,
        fechaInicioCiclo,
        fechaFinCiclo,
    } = cuota;

    const [showModal, setShowModal] = useState(false);
    const [instructor, setInstructor] = useState(null);
    const [loadingInstructor, setLoadingInstructor] = useState(true);

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

    const instructorPhotoUrl = instructor?.fotoURL || placeholderImage;
    const instructorName = instructor?.nombre || "Nombre Instructor";
    const servicioNombre = inscripcion.servicio.nombre || "Servicio";

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const fetchInstructor = async () => {
            setLoadingInstructor(true);
            try {
                const servicioData = await servicioService.getDetallesDeServicio(inscripcion.servicio.id);
                console.log(servicioData); // Verifica la estructura del objeto devuelto por la API.
                setInstructor(servicioData?.instructor || null); // Ajusta esto según la estructura de los datos.
            } catch (error) {
                console.error("Error fetching instructor details:", error);
            } finally {
                setLoadingInstructor(false);
            }
        };
        if (inscripcion.servicio.id) fetchInstructor();
    }, [inscripcion.servicio.id]);

    if (loadingInstructor) {
        return (
            <Card className="mb-3 shadow-sm" style={{ borderRadius: '20px', border: 'none' }}>
                <Card.Body className="text-center">Cargando detalles del instructor...</Card.Body>
            </Card>
        );
    }

    return (
        <>
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
                    padding: "12px",
                }}
            >
                <Card.Body>
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
                                    cursor: "pointer",
                                }}
                                onClick={handleShowModal}
                            >
                                <img
                                    src={instructorPhotoUrl}
                                    alt={instructorName}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            <span
                                style={{ fontSize: "16px", fontWeight: "500", cursor: "pointer" }}
                                onClick={handleShowModal}
                            >
                                {instructorName}
                            </span>
                        </Col>
                    </Row>

                    <Row className="align-items-stretch" style={{ height: "160px", overflow: "hidden" }}>
                        <Col xs={12} md={4} className="d-flex">
                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: "100%",
                                    overflow: "hidden",
                                    borderRadius: "6px",
                                    backgroundColor: "#2E2B5B",
                                }}
                            >
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
                                    <img
                                        src={logoUrl}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            position: "absolute",
                                            filter: "blur(1px) brightness(0.9)",
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: "relative",
                                            zIndex: 1,
                                            color: "#fff",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            textShadow: "0 0 5px rgba(0,0,0,0.5)",
                                            pointerEvents: "none",
                                        }}
                                    >
                                        {servicioNombre}
                                    </div>
                                </div>
                            </div>
                        </Col>

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

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Información del Instructor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <img
                            src={instructorPhotoUrl}
                            alt={instructorName}
                            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <h4 className="mt-3">{instructorName}</h4>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CuotaCard;