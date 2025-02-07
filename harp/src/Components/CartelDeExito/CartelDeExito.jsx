// SuccessModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";

const SuccessModal = ({ show, onClose, title = "¡Éxito!", message = "Operación realizada con éxito." }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body className="text-center">
        <FaCheckCircle size={80} color="green" />
        <h4 className="mt-3">{title}</h4>
        <p>{message}</p>
        <Button variant="primary" onClick={onClose}>
          Aceptar
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;
