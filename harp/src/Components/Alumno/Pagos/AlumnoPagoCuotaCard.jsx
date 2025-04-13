import React, { useState, useEffect } from "react";
import * as cuotaService from "../../../services/Cuota.js";
import * as servicioService from "../../../services/Servicio.js";
import { Card, Button, Row, Col, Badge, Modal } from "react-bootstrap";
import placeholderImage from "../../../assets/placeholderForServices.png";

const AlumnoPagoCuotaCard = ({ cuota, fetchCuotas }) => {
  const [comprobante, setComprobante] = useState(null);
  const [servicio, setServicio] = useState(null);
  const [loadingServicio, setLoadingServicio] = useState(true);
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal de pago

  // Verifica que cuota.cambiosEstado sea un array antes de usar find
  const estadoActual = Array.isArray(cuota.cambiosEstado)
    ? cuota.cambiosEstado.find((estado) => estado.fechaFin === null)
    : null;

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

  const handlePago = () => setShowModal(true); // Abre el modal de pago
  const handleComprobanteChange = (e) => setComprobante(e.target.files[0]); // Guarda el archivo seleccionado

  const handleConfirmarPago = async () => {
    try {
      if (!comprobante) {
        alert("Por favor, adjunte un comprobante de pago.");
        return;
      }

      const { id: idServicio } = cuota.inscripcion.servicio;
      const { id: idInscripcion } = cuota.inscripcion;
      const { id: idCuota } = cuota;

      // Llama al servicio para pagar la cuota
      await cuotaService.pagarCuota(idServicio, idInscripcion, idCuota, "Transferencia");

      // Actualiza la lista de cuotas después del pago
      fetchCuotas();
      setShowModal(false); // Cierra el modal
      setComprobante(null); // Limpia el archivo seleccionado
    } catch (error) {
      console.error("Error al confirmar el pago:", error.message);
      alert(`Error al procesar el pago: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchServicio = async () => {
      setLoadingServicio(true);
      try {
        if (cuota.inscripcion?.servicio?.id) {
          const servicioData = await servicioService.getDetallesDeServicio(cuota.inscripcion.servicio.id);
          setServicio(servicioData);
        }
      } catch (error) {
        console.error("Error fetching servicio details:", error);
      } finally {
        setLoadingServicio(false);
      }
    };
    fetchServicio();
  }, [cuota]);

  if (loadingServicio) {
    return (
      <Card
        className="mb-4 shadow-sm"
        style={{
          borderRadius: "16px",
          border: "none",
          height: "150px",
          background: "#1E1B4B",
          color: "#FFFFFF",
        }}
      >
        <Card.Body className="text-center">Cargando detalles del servicio...</Card.Body>
      </Card>
    );
  }

  if (!servicio) {
    return (
      <Card
        className="mb-4 shadow-sm"
        style={{
          borderRadius: "16px",
          border: "none",
          height: "150px",
          background: "#1E1B4B",
          color: "#FFFFFF",
        }}
      >
        <Card.Body className="text-center">Error al cargar detalles del servicio.</Card.Body>
      </Card>
    );
  }

  // Función para formatear el monto con separador de miles
  const formatCurrency = (amount) => {
    return amount.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <>
      {/* Modal para confirmar el pago */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Adjunte el comprobante de pago:</p>
          <input type="file" accept="image/*, application/pdf" onChange={handleComprobanteChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmarPago}>
            Confirmar Pago
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tarjeta principal */}
      <Card
        style={{
          border: "none",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.1)",
          minHeight: "150px",
          position: "relative",
          marginBottom: "20px",
        }}
      >
        <Card.Body>
          <Row className="g-0 align-items-center">
            {/* Imagen del Servicio */}
            <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
              <div
                style={{
                  width: "100%",
                  maxWidth: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  overflow: "hidden",
                  margin: "0 auto",
                }}
              >
                <img
                  src={servicio.logoURL || placeholderImage}
                  alt={servicio.nombre}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </Col>

            {/* Detalles del Servicio */}
            <Col xs={12} md={6}>
              <div style={{ padding: "10px" }}>
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#1E1B4B",
                    marginBottom: "8px",
                  }}
                >
                  {servicio.nombre}
                </h4>
                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "4px" }}>
                  <strong>Instructor:</strong> {cuota.instructor}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "4px" }}>
                  <strong>Ciclo:</strong> {cuota.fechaInicioCiclo} - {cuota.fechaFinCiclo}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "4px" }}>
                  <strong>Límite de Pago:</strong> {fechaLimitePago}
                </p>
                {fechaPago && (
                  <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "4px" }}>
                    <strong>Fecha de Pago:</strong> {fechaPago}
                  </p>
                )}
                <Badge
                  bg={badgeVariant}
                  style={{
                    padding: "4px 8px",
                    fontSize: "0.8rem",
                    marginTop: "8px",
                  }}
                >
                  {estadoLabel}
                </Badge>
              </div>
            </Col>

            {/* Botón de Acción */}
            <Col xs={12} md={3} className="d-flex flex-column justify-content-center align-items-center">
              <h3
                className="fw-bold m-0"
                style={{
                  fontSize: "1.2rem",
                  color: "#1E1B4B",
                  marginBottom: "8px",
                }}
              >
                ${formatCurrency(totalMonto)}
              </h3>
              <Button
                size="sm"
                style={{
                  backgroundColor: "#4F46E5",
                  borderColor: "#4F46E5",
                  borderRadius: "8px",
                  padding: "8px 16px",
                }}
                onClick={handlePago}
                disabled={!mostrarBotonPagar}
              >
                {mostrarBotonPagar ? "Pagar" : "Pago"}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default AlumnoPagoCuotaCard;