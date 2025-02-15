// src/components/Profile/ChangePasswordModal.js
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { cambiarContrasena } from "../../services/Usuario";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const ChangePasswordModal = ({ profileData, show, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    handleChangePassword({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    try {
      await cambiarContrasena(profileData?.usuario?.id, currentPassword, newPassword);
      console.log("Cambiando contraseña:", currentPassword, newPassword);
      alert("Se ha cambiado la contraseña");
    } catch (error) {
      alert(error);
      console.error("Error al cambiar la contraseña:", error);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton style={{ backgroundColor: "#1E1B4B", color: "white" }}>
        <Modal.Title>Cambiar Contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form>
          <Form.Group controlId="currentPassword" className="mb-3">
            <Form.Label>Contraseña Actual</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                {showCurrentPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </div>
          </Form.Group>
          <Form.Group controlId="newPassword" className="mb-3">
            <Form.Label>Nueva Contraseña</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showNewPassword ? "text" : "password"}
                placeholder="Ingrese la nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </div>
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="mb-3">
            <Form.Label>Confirmar Nueva Contraseña</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme la nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;