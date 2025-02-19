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
    <Card
      className="mb-3"
      style={{
        borderRadius: '20px',
        border: 'none',
        minHeight: '200px',
        position: 'relative',
        width: isPanelCollapsed ? '80vw' : 'auto',
        boxShadow: '0px 4px 19px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Card.Header
        style={{
          backgroundColor: '#1E1B4B',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '15px',
        }}
      >
        {servicio.nombre}
      </Card.Header>
      <Card.Body>
        <Row className="g-0 align-items-center">
          <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
            <img
              src={servicio.logoURL || placeholderImage}
              alt={servicio.nombre}
              style={{
                width: '100%',
                maxWidth: '120px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '10px',
              }}
            />
          </Col>
          <Col xs={12} md={8}>
            <div style={{ padding: '20px 15px' }}>
              <p>
                <strong>Estado:</strong> <Badge bg={badgeVariant}>{estadoLabel}</Badge>
              </p>
              <p>
                <strong>Nombre del Instructor:</strong> {cuota.instructor}  {/* Ahora sí se muestra */}
              </p>
              <p>
                <strong>Fecha de Inicio:</strong> {cuota.fechaInicioCiclo}
              </p>
              <p>
                <strong>Fecha de Fin:</strong> {cuota.fechaFinCiclo}
              </p>
              <p>
                <strong>Fecha Límite de Pago:</strong> {fechaLimitePago}
              </p>
              {fechaPago && (
                <p>
                  <strong>Fecha de Pago:</strong> {fechaPago}
                </p>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0" style={{ marginLeft: '15px' }}>
                <strong>Cantidad a Abonar:</strong> <strong style={{ fontSize: '1.5rem', color: '#4F46E5' }}>${totalMonto}</strong>
              </p>
              {mostrarBotonPagar && (
                <Button
                  size="sm"
                  style={{ backgroundColor: '#4F46E5', borderColor: '#4F46E5' }}
                  onClick={handlePago}
                >
                  Pagar
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
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
    </Card>
  );
};

export default AlumnoPagoCuotaCard;