{/*
import React from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

export default function ModalActualizarMontos({
  showModal,
  setShowModal,
  availableFrequencies,
  hasMontoForFrequency,
  handleAddMonto,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    handleAddMonto(data);
    reset(); // Reinicia el formulario después de enviar los datos
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar monto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Frecuencia semanal</Form.Label>
            <Form.Select
              {...register("selectedFrequency", {
                required: "Seleccione una frecuencia semanal.",
              })}
            >
              <option value="">Seleccione...</option>
              {availableFrequencies.length > 0 ? (
                availableFrequencies.map((freq, index) => (
                  <option key={index} value={freq}>
                    {freq.horarios.length} veces por semana
                  </option>
                ))
              ) : (
                <option disabled>No hay frecuencias disponibles</option>
              )}
            </Form.Select>
            {errors.selectedFrequency && (
              <small className="text-danger">
                {errors.selectedFrequency.message}
              </small>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de inicio</Form.Label>
            <Form.Control
              type="date"
              {...register("startDate", {
                required: "Seleccione una fecha de inicio.",
                validate: (value) => {
                  const selectedDate = new Date(value);
                  const today = new Date();
                  selectedDate.setHours(0, 0, 0, 0);
                  today.setHours(0, 0, 0, 0);

                  if (selectedDate <= today) {
                    return "La fecha debe ser posterior a hoy.";
                  }

                  return true;
                },
              })}
            />
            {errors.startDate && (
              <small className="text-danger">{errors.startDate.message}</small>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              {...register("amount", {
                required: "Ingrese un monto.",
                validate: (value) =>
                  value > 0 || "El monto debe ser mayor a cero.",
              })}
            />
            {errors.amount && (
              <small className="text-danger">{errors.amount.message}</small>
            )}
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Confirmar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
*/}
