import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

function ModalMontoInscripcion({ showModal, setShowModal, handleRegister }) {
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

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Monto de Inscripción</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo de Monto */}
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
            />
            {errors.monto && (
              <small className="text-danger">{errors.monto.message}</small>
            )}
          </Form.Group>

          {/* Casillas para elegir si el monto se paga en la primera cuota */}
          <Form.Group className="mb-3">
            <Form.Label>¿El monto se paga en la primera cuota?</Form.Label>
            <Row>
              <Col>
                <Form.Check
                  type="radio"
                  label="Sí"
                  {...register("pagaEnPrimeraCuota", {
                    required: "Debe elegir una opción.",
                  })}
                  value="si"
                />
              </Col>
              <Col>
                <Form.Check
                  type="radio"
                  label="No"
                  {...register("pagaEnPrimeraCuota", {
                    required: "Debe elegir una opción.",
                  })}
                  value="no"
                />
              </Col>
            </Row>
            {errors.pagaEnPrimeraCuota && (
              <small className="text-danger">
                {errors.pagaEnPrimeraCuota.message}
              </small>
            )}
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

export default ModalMontoInscripcion;
