import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

function ModalConfigurarMonto({ showModal, setShowModal, fetchFrequencies, handleRegister }) {
  const [frequencies, setFrequencies] = useState([]);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    mode: "onChange",
  });

  // Cargar frecuencias desde el servicio al cargar el modal
  useEffect(() => {
    const getFrequencies = async () => {
      const fetchedFrequencies = await fetchFrequencies();
      setFrequencies(fetchedFrequencies);
    };

    if (showModal) {
      getFrequencies();
    }
  }, [showModal, fetchFrequencies]);

  const onSubmit = (data) => {
    handleRegister(data);
    setShowModal(false); // Cerrar el modal después de registrar
    reset(); // Reiniciar el formulario
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

          {/* Campo de Frecuencia de pagos */}
          <Form.Group className="mb-3">
            <Form.Label>Frecuencia de Pagos</Form.Label>
            <Form.Select {...register("paymentFrequency", { required: "Seleccione una frecuencia" })}>
              <option value="">Seleccione...</option>
              {frequencies.map((frequency, index) => (
                <option key={index} value={frequency}>
                  {frequency} veces por mes
                </option>
              ))}
            </Form.Select>
            {errors.paymentFrequency && (
              <small className="text-danger">{errors.paymentFrequency.message}</small>
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