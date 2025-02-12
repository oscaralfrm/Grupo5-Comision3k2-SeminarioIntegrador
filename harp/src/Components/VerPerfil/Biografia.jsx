// components/Profile/Biography.js
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCog } from "react-icons/fa";
import { editarBiografiaUsuario } from "../../services/Usuario";

const Biography = ({ profileData, onSave, sePuedeEditar }) => {
  const [editMode, setEditMode] = useState(false);
  const [biografia, setBiografia] = useState(profileData?.usuario?.biografia || "");

  const handleSave = async () => {
      try {
        console.log("biografia", biografia);
        console.log("profile", profileData)
        await editarBiografiaUsuario(profileData?.usuario?.id, biografia);
        setEditMode(false);
        if (onSave) onSave(biografia);
      } catch (error) {
        console.error("Error al editar la biografia:", error);
      }
    };

  const handleCancel = () => {
    setBiografia(profileData?.usuario?.biografia || "");
    setEditMode(false);
  };

  return (
    <div className="card shadow-lg p-4 mb-4" style={{ position: "relative" }}>
      { sePuedeEditar &&
       (!editMode ? (
        <Button
          variant="light"
          className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute"
          onClick={() => setEditMode(true)}
          style={{ backgroundColor: "#1E1B4B", border: "none", top: "10px", right: "10px", zIndex: 10 }}
        >
          <FaCog color="white" size={20} />
        </Button>
      ) : (
        <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
          <Button variant="success" size="sm" onClick={handleSave} className="me-2">Guardar</Button>
          <Button variant="secondary" size="sm" onClick={handleCancel}>Cancelar</Button>
        </div>
      )) }
      <h3 style={{ color: "#6a5acd" }}>Biografía</h3>
      <hr />
      {editMode ? (
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={5}
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
          />
        </Form.Group>
      ) : (
        profileData?.usuario?.biografia ? (
          <p>{profileData.usuario?.biografia}</p>
        ) : (
            sePuedeEditar ?
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            No has completado tu biografía.
          </div>
          : <div></div>
        )
      )}
    </div>
  );
};

export default Biography;
