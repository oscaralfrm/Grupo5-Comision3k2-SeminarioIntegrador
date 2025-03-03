import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaLightbulb } from "react-icons/fa"; // Asegúrate de tener react-icons instalado

const SuccessCard = ({ nombreServicio, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
      }}
    >
      <Card style={{ width: "20rem", textAlign: "center", padding: "20px" }}>
        <div style={{ position: "absolute", right: "10px", top: "10px" }}>
          {/* <Button variant="link" onClick={onClose} aria-label="Cerrar">
            ×
          </Button> */}
        </div>
        <Card.Body>
          <div style={{ fontSize: "2rem", color: "#6a5acd" }}>
            <FaLightbulb />
          </div>
          <Card.Title>¡Felicitaciones!</Card.Title>
          <Card.Text>
            El servicio: <strong>{nombreServicio}</strong> ha sido creado satisfactoriamente.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SuccessCard;