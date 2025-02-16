import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const EditarReseniaModal = ({ show, handleClose, review, handleSave }) => {
  const [formData, setFormData] = useState({
    mensaje: review.mensaje,
    calificacion: review.calificacion,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStarClick = (rating) => {
    setFormData({ ...formData, calificacion: rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Reseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formMensaje">
            <Form.Label>Mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="mensaje"
              value={formData.mensaje}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formCalificacion">
            <Form.Label>Calificación</Form.Label>
            <div>
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  color={i < formData.calificacion ? "#ffc107" : "#e4e5e9"}
                  onClick={() => handleStarClick(i + 1)}
                  style={{ cursor: "pointer", marginRight: "5px" }}
                />
              ))}
            </div>
          </Form.Group>
          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
          <Button variant="secondary" onClick={handleClose} className="ms-2">
            Cancelar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditarReseniaModal;