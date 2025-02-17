import React, { useState, useEffect } from "react";
import * as cuotaService from '../../../services/Cuota.js';
import * as servicioService from '../../../services/Servicio.js';
import * as instructorService from '../../../services/Instructor.js';
import { Card, Button, Row, Col, Badge, Modal } from 'react-bootstrap';
import placeholderImage from "../../../assets/placeholderForServices.png";

const AlumnoPagoCuotaCard = ({ cuota, fetchCuotas }) => {
  const [showModal, setShowModal] = useState(false);
  const [comprobante, setComprobante] = useState(null);
  const [servicio, setServicio] = useState(null);
  const [instructor, setInstructor] = useState("Desconocido");
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
    const fetchServicioEInstructor = async () => {
      setLoadingServicio(true);
      try {
        const servicioData = await servicioService.getDetallesDeServicio(cuota.inscripcion.servicio.id);
        setServicio(servicioData);
        const instructorData = await instructorService.obtenerInstructorDeServicio(cuota.inscripcion.servicio.id);
        setInstructor(instructorData.nombre || "Desconocido");
      } catch (error) {
        console.error("Error fetching servicio or instructor details:", error);
      } finally {
        setLoadingServicio(false);
      }
    };
    if (cuota.inscripcion.servicio.id) fetchServicioEInstructor();
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
    <Card className="mb-3 shadow-sm" style={{ borderRadius: '20px', border: 'none' }}>
      <Card.Header style={{ backgroundColor: '#1E1B4B', color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
        {servicio.nombre}
      </Card.Header>
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
            <img src={servicio.logoURL || placeholderImage} alt={servicio.nombre} style={{ width: '100%', maxWidth: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px' }} />
          </Col>
          <Col xs={12} md={8}>
            <Row>
              <Col xs={12} className="mb-2">
                <strong>Estado:</strong> <Badge bg={badgeVariant}>{estadoLabel}</Badge>
              </Col>
              <Col xs={12} className="mb-2">
                <strong>Nombre del Instructor:</strong> {instructor}
              </Col>
              <Col xs={12} className="mb-2">
                <strong>Fecha de Inicio:</strong> {cuota.fechaInicioCiclo}
              </Col>
              <Col xs={12} className="mb-2">
                <strong>Fecha de Fin:</strong> {cuota.fechaFinCiclo}
              </Col>
              <Col xs={12} className="mb-2">
                <strong>Fecha Límite de Pago:</strong> {fechaLimitePago}
              </Col>
              {fechaPago && (
                <Col xs={12} className="mb-2">
                  <strong>Fecha de Pago:</strong> {fechaPago}
                </Col>
              )}
              <Col xs={12} className="mb-3">
                <span className="fs-5 fw-bold" style={{ color: '#4F46E5' }}>Cantidad a Abonar: ${totalMonto}</span>
              </Col>
              {mostrarBotonPagar && (
                <Col xs={12} className="d-flex justify-content-end">
                  <Button variant="primary" onClick={handlePago} style={{ backgroundColor: '#4F46E5', borderColor: '#4F46E5' }}>Pagar</Button>
                </Col>
              )}
            </Row>
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