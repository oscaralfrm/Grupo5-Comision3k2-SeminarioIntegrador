import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { editarBiografiaUsuario } from "../../services/Usuario";
import { agregarCvInstructor } from "../../services/Instructor";
import Curriculum from "./Curriculum/Curriculum";

const Biography = ({ profileData, onSave, sePuedeEditar }) => {
  const [editMode, setEditMode] = useState(false);
  const [biografia, setBiografia] = useState(
    profileData?.usuario?.biografia || ""
  );
  const [cvFile, setCvFile] = useState(null);
  const { idInstructor } = useParams();
  const [showFullBiography, setShowFullBiography] = useState(false);

  const handleSave = async () => {
    try {
      await editarBiografiaUsuario(profileData?.usuario?.id, biografia);
      let cvFileURL = profileData?.cvURL;
      if (cvFile) {
        cvFileURL = await agregarCvInstructor(profileData.id, cvFile);
      }
      setEditMode(false);
      if (onSave) onSave({ biografia, cvFileURL });
    } catch (error) {
      console.error("Error al editar la biografía:", error);
    }
  };

  const handleCancel = () => {
    setBiografia(profileData?.usuario?.biografia || "");
    setCvFile(null);
    setEditMode(false);
  };

  const toggleBiographyVisibility = () => {
    setShowFullBiography(!showFullBiography);
  };

  const biographyToShow =
    showFullBiography || biografia.length <= 400
      ? biografia
      : biografia.substring(0, 400) + "...";

  return (
    <div className="card shadow-lg p-4 mb-4" style={{ position: "relative" }}>
      {sePuedeEditar &&
        (!editMode ? (
          <Button
            variant="light"
            className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute"
            onClick={() => setEditMode(true)}
            style={{
              backgroundColor: "white",
              border: "none",
              top: "30px",
              right: "30px",
              zIndex: 10,
            }}
          >
            <i className="bi bi-pencil-fill" style={{ color: "#1E1B4B" }}></i>
          </Button>
        ) : null)}
      <h3
        style={{
          color: "#1E1B4B",
          padding: "10px",
        }}
      >
        Biografía
      </h3>
      <hr />
      {editMode ? (
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={5}
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              gap: "10px",
            }}
          >
            <Button variant="success" size="sm" onClick={handleSave}>
              Guardar
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </Form.Group>
      ) : profileData?.usuario?.biografia ? (
        <p style={{ display: "inline" }}>
          {biographyToShow}
          {biografia.length > 400 && (
            <Button
              variant="link"
              onClick={toggleBiographyVisibility}
              style={{
                padding: 0,
                marginLeft: "5px",
                display: "inline",
                fontSize: "inherit",
              }}
            >
              {showFullBiography ? "Ver menos" : "Ver más"}
            </Button>
          )}
        </p>
      ) : sePuedeEditar ? (
        <div
          className="alert alert-warning d-flex align-items-center"
          role="alert"
        >
          No has completado tu biografía.
        </div>
      ) : (
        <div></div>
      )}

      {/* Sección para el Currículum Vitae */}
      {idInstructor && (
        <div className="mt-4">
          <Curriculum
            profileData={profileData}
            editMode={editMode}
            cvFile={cvFile}
            setCvFile={setCvFile}
            sePuedeEditar={sePuedeEditar}
          />
        </div>
      )}
    </div>
  );
};

export default Biography;
