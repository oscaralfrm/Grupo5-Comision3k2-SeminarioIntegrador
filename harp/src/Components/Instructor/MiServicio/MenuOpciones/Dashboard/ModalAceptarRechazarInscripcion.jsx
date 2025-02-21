import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EnrollmentModal = ({
  show,
  onClose,
  onSubmit,
  enrollment,
  type // "accept" o "reject"
}) => {
  // Para el modal de aceptación usamos una fecha, para el rechazo un texto
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (show) {
      if (type === "accept") {
        const today = new Date().toISOString().split("T")[0];
        setInputValue(today);
      } else {
        setInputValue("");
      }
    }
  }, [show, type]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(enrollment, inputValue);
    onClose();
  };

  if (!enrollment) return null;

  // Definimos textos y etiquetas según el tipo de modal
  const modalTitle = type === "accept" ? "Aceptar inscripción" : "Rechazar inscripción";
  const inputLabel =
    type === "accept"
      ? "Fecha de inicio de actividad"
      : "Motivo del rechazo";

  // Obtiene la fecha actual en la zona horaria de Argentina
  const todayArgentina = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires'
  });

  const inputControlProps =
    type === "accept"
      ? {
        type: "date",
        min: todayArgentina,
      }
      : {
        as: "textarea",
        rows: 3,
        placeholder: "Ingrese el motivo del rechazo",
      };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Alumno:</strong>{" "}
          {enrollment.alumno.nombreCompleto}
        </p>
        <p>
          <strong>Grupo:</strong> {enrollment.grupo.nombre}
        </p>
        <p>
          <strong>Fecha de solicitud:</strong> {enrollment.fechaSolicitud}
        </p>
        <Form.Group>
          <Form.Label>{inputLabel}</Form.Label>
          <Form.Control
            value={inputValue}
            onChange={handleChange}
            {...inputControlProps}
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

export default EnrollmentModal;
