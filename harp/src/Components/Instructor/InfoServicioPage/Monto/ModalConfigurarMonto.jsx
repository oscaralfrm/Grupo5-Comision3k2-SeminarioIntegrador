import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

function ModalConfigurarMonto({
  showModal,
  setShowModal,
  handleRegister,
  initialPaymentFrequency // Recibimos la frecuencia de pago como parámetro
}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data) => {
    handleRegister(data);
    setShowModal(false); // Cerrar el modal después de registrar
    reset(); // Reiniciar el formulario
  };

  // Validación personalizada para la fecha (debe ser posterior a la fecha actual)
  const validateDate = (date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);
    return selectedDate > currentDate || "La fecha debe ser posterior a la fecha actual.";
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Configurar Monto y Frecuencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo de Monto */}
          <Form.Group className="mb-3">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              {...register("amount", {
                required: "El monto es obligatorio.",
                min: {
                  value: 1,
                  message: "El monto debe ser mayor a cero.",
                },
              })}
              placeholder="Ingrese el monto"
            />
            {errors.amount && <small className="text-danger">{errors.amount.message}</small>}
          </Form.Group>

          {/* Campo de Frecuencia de pagos (ahora solo visualización) */}
          <Form.Group className="mb-3">
            <Form.Label>Frecuencia de actividades:</Form.Label>
            <Form.Control
              type="text"
              value={initialPaymentFrequency}
              readOnly // Hacer el campo de frecuencia solo lectura
            />
          </Form.Group>

          {/* Campo de Fecha */}
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Pago</Form.Label>
            <Form.Control
              type="date"
              {...register("paymentDate", {
                required: "La fecha es obligatoria.",
                validate: validateDate,
              })}
            />
            {errors.paymentDate && <small className="text-danger">{errors.paymentDate.message}</small>}
          </Form.Group>
        </Form>
      </Modal.Body>

      {/* Botones de acción */}
      <Modal.Footer>
        <Row style={{ width: "100%" }}>
          <Col className="d-flex justify-content-start">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button variant="primary" type="submit" onClick={handleSubmit(onSubmit)}>
              Registrar
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalConfigurarMonto;
