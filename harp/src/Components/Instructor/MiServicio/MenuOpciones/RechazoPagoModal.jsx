import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RechazoPagoModal = ({ 
  show, 
  onClose, 
  motivoRechazo,
  setMotivoRechazo,
  handleSubmit,
  cuota
}) => {

  // Definimos textos y etiquetas según el tipo de modal
  const modalTitle = "Rechazo pago";
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Alumno:</strong>{" "}
        </p>
        <p>
          <strong>Total:</strong> ${cuota?.montoServicio.monto + cuota?.recargo}
        </p>
        <p>
          <strong>Fecha de pago:</strong> {cuota?.pago?.fechaPago}
        </p>
        <Form.Group>
            <Form.Label><strong>Motivo del Rechazo:</strong></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              placeholder="Escribe el motivo..."
            />
          </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RechazoPagoModal;
