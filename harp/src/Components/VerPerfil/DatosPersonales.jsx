// components/Profile/PersonalData.js
import React, { useState } from "react";
import { ListGroup, Button, Form } from "react-bootstrap";
import { FaCog, FaExclamationCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { editAlumno } from "../../services/Alumno"; // Ajusta la ruta según corresponda
import { editUsuario } from "../../services/Usuario";

const PersonalData = ({ profileData, isMissing, onSave, sePuedeEditar }) => {
  const { idAlumno } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState({
    nombre: profileData?.usuario?.nombre || "",
    apellido: profileData?.usuario?.apellido || "",
    fechaNacimiento: profileData?.usuario?.fechaNacimiento || "",
    dni: profileData?.usuario?.dni || "",
    ubicacion: profileData?.usuario?.ubicacion || "",
    telefono: profileData?.usuario?.telefono || "",
  });

  const handleChange = (field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
    const usuarioDTO = {
        idUsuario: profileData.usuario.id,
        nombre: localData.nombre,      // Usamos nombreUsuario como "nombre"
        apellido: localData.apellido,
        dni: localData.dni,
        nombreUsuario: profileData.usuario.nombreUsuario,      // nombreUsuario  permanece igual
        contrasena: "",                           // contrasena (no se edita aquí)
        email: profileData.usuario.email,    // email permanece igual
        telefono: localData.telefono,
        fechaNacimiento: localData.fechaNacimiento,
        fotoPerfilURL: profileData.usuario.fotoPerfilURL // fotoPerfil permanece igual
    }
      await editUsuario(usuarioDTO);
      setEditMode(false);
      if (onSave) onSave(localData);
    } catch (error) {
      console.error("Error al editar alumno:", error);
    }
  };

  const handleCancel = () => {
    setLocalData({
      nombreUsuario: profileData?.usuario.nombreUsuario || "",
      apellido: profileData?.usuario.apellido || "",
      fechaNacimiento: profileData?.usuario.fechaNacimiento || "",
      dni: profileData?.usuario.dni || "",
      ubicacion: profileData?.usuario.ubicacion || "",
      telefono: profileData?.usuario.telefono || "",
    });
    setEditMode(false);
  };

  return (
    <div className="card shadow-lg p-4 mb-4" style={{ position: "relative", height: "100%" }}>
      {sePuedeEditar &&
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
          <Button variant="success" size="sm" onClick={handleSave} className="me-2">
            Guardar
          </Button>
          <Button variant="secondary" size="sm" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      ))}
      <h3 style={{ color: "#6a5acd" }}>Datos Personales</h3>
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100% - 50px)" }}>
        <ListGroup variant="flush" style={{ flex: 1, display: "flex", flexDirection: "column", margin: 0 }}>
          {[
            { label: "Nombre", field: "nombre", type: "text" },
            { label: "Apellido", field: "apellido", type: "text" },
            { label: "Fecha de Nacimiento", field: "fechaNacimiento", type: "date" },
            { label: "DNI", field: "dni", type: "text" },
            { label: "Nacionalidad", field: "ubicacion", type: "text" },
            { label: "Teléfono", field: "telefono", type: "text" },
          ].map((item) => (
            <ListGroup.Item
              key={item.field}
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                padding: "0.2rem 0.5rem",
              }}
            >
              <strong style={{ width: "40%" }}>{item.label}: </strong>
              <div style={{ width: "60%" }}>
                {editMode ? (
                  <Form.Control
                    type={item.type}
                    value={localData[item.field]}
                    onChange={(e) => handleChange(item.field, e.target.value)}
                  />
                ) : (
                  localData[item.field] || "No especificado"
                )}
                {isMissing(localData[item.field]) && !editMode && sePuedeEditar && (
                  <FaExclamationCircle className="ms-2 text-danger" />
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default PersonalData;
