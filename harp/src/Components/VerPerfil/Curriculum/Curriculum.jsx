import React from "react";
import { Form } from "react-bootstrap";
import { FaExclamationCircle } from "react-icons/fa";

const Curriculum = ({ profileData, editMode, cvFile, setCvFile, sePuedeEditar }) => {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  return (
    <div>
      {sePuedeEditar ? (
        profileData?.cvURL ? (
          <div>
            <a
              href={profileData.cvURL}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-link"
            >
              Ver Curriculum Vitae
            </a>
            <p className="mt-2">
              Archivo cargado:{" "}
              <strong>
                {profileData?.cvURL.split("/").pop().split("_").slice(1).join("_") ||
                  "Documento adjunto"}
              </strong>
            </p>
            {editMode && (
              <Form.Group controlId="uploadCV" className="mt-3">
                <Form.Label>Reemplazar CV:</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
            )}
          </div>
        ) : !editMode ? (
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <FaExclamationCircle className="me-2" />
            No has subido tu currículum vitae.
          </div>
        ) : (
          <div className="mt-3">
            <Form.Group controlId="uploadCV">
              <Form.Label>Subir CV:</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            {cvFile && (
              <p className="mt-2">
                Archivo seleccionado: <strong>{cvFile.name}</strong>
              </p>
            )}
          </div>
        )
      ) : profileData?.cvURL ? (
        <div>
          <a
            href={profileData.cvURL}
            target="_blank"
            rel="noopener noreferrer"
            className="cv-link"
          >
            Ver Curriculum Vitae
          </a>
        </div>
      ) : null}
      <style jsx>{`
        .cv-link {
          color: #4A47A3;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.2s ease-in-out;
        }
        .cv-link:hover {
          text-decoration: underline;
          color: #6A67D8;
        }
      `}</style>
    </div>
  );
};

export default Curriculum;