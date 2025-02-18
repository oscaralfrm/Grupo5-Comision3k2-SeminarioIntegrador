{/*
import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

function ModalConfigurarMonto({
  showModal,
  setShowModal,
  handleRegister,
  unMonto, // Recibimos el monto como parámetro
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
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
    return (
      selectedDate > currentDate ||
      "La fecha debe ser posterior a la fecha actual."
    );
  };

  // Condición para saber si el campo de monto debe ser habilitado
  const isAmountEditable = () => {
    const fechaInicio = unMonto?.fechaInicio; // Asegurarse de que no sea undefined
    if (!fechaInicio) {
      return true; // Si fechaInicio es undefined, permitir modificar monto
    }

    const currentDate = new Date();
    const startDate = new Date(fechaInicio);

    // Si la fecha de inicio es futura, permitir modificar el monto
    return startDate > currentDate;
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Configurar Monto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
         
          <Form.Group className="mb-3">
            <Form.Label>Frecuencia de actividades:</Form.Label>
            <Form.Control
              type="text"
              value={unMonto?.horarios?.length || "Todavía no definido"} // Agregamos un chequeo para evitar el error
              readOnly // Hacer el campo de frecuencia solo lectura
            />
          </Form.Group>

       
          <Form.Group className="mb-3">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              {...register("monto", {
                required: "El monto es obligatorio.",
                min: {
                  value: 1,
                  message: "El monto debe ser mayor a cero.",
                },
              })}
              placeholder="Ingrese el monto"
              disabled={!isAmountEditable()} // Deshabilitar el campo si no se puede editar
            />
            {errors.amount && (
              <small className="text-danger">{errors.amount.message}</small>
            )}
          </Form.Group>

        </Form>
      </Modal.Body>

     
      <Modal.Footer>
        <Row style={{ width: "100%" }}>
          <Col className="d-flex justify-content-start">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button
              variant="primary"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              Registrar
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalConfigurarMonto;

*/}
