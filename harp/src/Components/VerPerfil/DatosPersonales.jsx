import React, { useState } from "react";
import { ListGroup, Button, Form } from "react-bootstrap";
import { FaExclamationCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
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
        nombre: localData.nombre,
        apellido: localData.apellido,
        dni: localData.dni,
        nombreUsuario: profileData.usuario.nombreUsuario,
        contrasena: "",
        email: profileData.usuario.email,
        telefono: localData.telefono,
        fechaNacimiento: localData.fechaNacimiento,
        fotoPerfilURL: profileData.usuario.fotoPerfilURL,
        ubicacion: localData.ubicacion, // Asegúrate de incluir este campo
      };

      console.log("Datos a guardar:", usuarioDTO); // Verifica los datos que se envían

      await editUsuario(usuarioDTO);
      setEditMode(false);
      if (onSave) onSave(localData);
    } catch (error) {
      console.error("Error al editar alumno:", error);
    }
  };

  const handleCancel = () => {
    setLocalData({
      nombre: profileData?.usuario?.nombre || "",
      apellido: profileData?.usuario?.apellido || "",
      fechaNacimiento: profileData?.usuario?.fechaNacimiento || "",
      dni: profileData?.usuario?.dni || "",
      ubicacion: profileData?.usuario?.ubicacion || "",
      telefono: profileData?.usuario?.telefono || "",
    });
    setEditMode(false);
  };

  return (
    <div className="card shadow-lg p-4 mb-4" style={{ position: "relative", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ color: "#1E1B4B", margin: "10px 0" }}>Datos Personales</h3>
        {sePuedeEditar && (
          <div style={{ display: "flex", gap: "5px" }}>
            {editMode ? (
              <>
                <Button variant="success" size="sm" style={{ width: "30px", height: "30px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={handleSave}>
                  ✓
                </Button>
                <Button variant="secondary" size="sm" style={{ width: "30px", height: "30px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={handleCancel}>
                  ✕
                </Button>
              </>
            ) : (
              <Button
                variant="light"
                style={{ width: "30px", height: "30px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={() => setEditMode(true)}
              >
                <i className="bi bi-pencil-fill"></i>
              </Button>
            )}
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100% - 50px)" }}>
        <ListGroup
          variant="flush"
          style={{ flex: 1, display: "flex", flexDirection: "column", margin: 0 }}
        >
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
              className="d-flex align-items-center"
              style={{ padding: "0.5rem" }}
            >
              <strong style={{ flex: "0 0 40%" }}>{item.label}: </strong>
              <div style={{ flex: "1" }}>
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
