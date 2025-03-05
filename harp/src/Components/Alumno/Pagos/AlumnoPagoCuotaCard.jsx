import React, { useState, useEffect } from "react";
import * as cuotaService from '../../../services/Cuota.js';
import * as servicioService from '../../../services/Servicio.js';
import { Card, Button, Row, Col, Badge, Modal } from 'react-bootstrap';
import placeholderImage from "../../../assets/placeholderForServices.png";

const AlumnoPagoCuotaCard = ({ cuota, fetchCuotas, isPanelCollapsed }) => {
  const [showModal, setShowModal] = useState(false);
  const [comprobante, setComprobante] = useState(null);
  const [servicio, setServicio] = useState(null);
  const [loadingServicio, setLoadingServicio] = useState(true);

  const estadoActual = cuota.cambiosEstado?.find(estado => estado.fechaFin === null);
  const mostrarBotonPagar = estadoActual && ["Pendiente", "Vencida"].includes(estadoActual.estadoCuota);
  const totalMonto = (cuota.montoServicio?.monto || 0) + (cuota.recargo || 0);

  let estadoLabel = "";
  let badgeVariant = "secondary";

  if (estadoActual) {
    estadoLabel = estadoActual.estadoCuota;
    if (estadoActual.estadoCuota === "Pendiente") badgeVariant = "warning";
    if (estadoActual.estadoCuota === "Abonada") badgeVariant = "success";
    if (["Anulada", "Vencida"].includes(estadoActual.estadoCuota)) badgeVariant = "danger";
  }

  let fechaLimitePago = cuota.fechaLimitePago;
  let fechaPago = cuota.pago?.fechaPago;

  const handlePago = () => setShowModal(true);
  const handleComprobanteChange = (e) => setComprobante(e.target.files[0]);

  const handleConfirmarPago = async () => {
    try {
      if (!comprobante) return;
      const { id: idServicio } = cuota.inscripcion.servicio;
      const { id: idInscripcion } = cuota.inscripcion;
      const { id: idCuota } = cuota;
      await cuotaService.pagarCuotaConTransferenciaPorAlumno(idServicio, idInscripcion, idCuota, "Transferencia", comprobante);
      fetchCuotas();
    } catch (error) {
      console.error("Error confirming payment:", error);
    } finally {
      setShowModal(false);
      setComprobante(null);
    }
  };

  useEffect(() => {
    const fetchServicio = async () => {
      setLoadingServicio(true);
      try {
        const servicioData = await servicioService.getDetallesDeServicio(cuota.inscripcion.servicio.id);
        setServicio(servicioData);
      } catch (error) {
        console.error("Error fetching servicio details:", error);
      } finally {
        setLoadingServicio(false);
      }
    };
    if (cuota.inscripcion.servicio.id) fetchServicio();
  }, [cuota]);

  if (loadingServicio) {
    return (
      <Card className="mb-3 shadow-sm" style={{ borderRadius: '20px', border: 'none' }}>
        <Card.Body className="text-center">Cargando detalles del servicio...</Card.Body>
      </Card>
    );
  }

  if (!servicio) {
    return (
      <Card className="mb-3 shadow-sm" style={{ borderRadius: '20px', border: 'none' }}>
        <Card.Body className="text-center">Error al cargar detalles del servicio.</Card.Body>
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
          height: isPanelCollapsed ? "auto" : "auto", // Ajusta la altura aquí
          overflow: "hidden", // Evita que el contenido se desborde
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
                }}
              >
                <img
                  src={placeholderImage}
                  alt="Instructor"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <span
                style={{ fontSize: "16px", fontWeight: "500" }}
              >
                {cuota.instructor}
              </span>
            </Col>
          </Row>

          <Row className="align-items-stretch" style={{ height: "auto", overflow: "hidden" }}>
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
                    src={servicio.logoURL || placeholderImage}
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
                    {servicio.nombre}
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={12} md={8} className="d-flex flex-column h-100">
              <div style={{ flex: 1 }}>
                <div style={{ flex: 1 }}>
                  <Card.Text style={{ fontSize: "14px", color: "#C0C8E0" }}>
                    <strong>Estado:</strong> <Badge bg={badgeVariant}>{estadoLabel}</Badge>
                  </Card.Text>
                  <Card.Text style={{ fontSize: "14px", color: "#C0C8E0" }}>
                    <strong>Ciclo:</strong> {cuota.fechaInicioCiclo} - {cuota.fechaFinCiclo}
                  </Card.Text>
                  <Card.Text style={{ fontSize: "14px", color: "#C0C8E0" }}>
                    <strong>Límite de Pago:</strong> {fechaLimitePago}
                  </Card.Text>
                  {fechaPago && (
                    <Card.Text style={{ fontSize: "14px", color: "#C0C8E0" }}>
                      <strong>Fecha de Pago:</strong> {fechaPago}
                    </Card.Text>
                  )}
                </div>
                <Row className="mt-auto">
                  <Col xs={6}>
                    <h2 className="fw-bold m-0">${totalMonto.toLocaleString()}</h2>
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
                      onClick={handlePago}
                      disabled={!mostrarBotonPagar}
                    >
                      {mostrarBotonPagar ? "Pagar" : "Abonada"}
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Subir Comprobante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" className="form-control" onChange={handleComprobanteChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirmarPago}>Confirmar Pago</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AlumnoPagoCuotaCard;
