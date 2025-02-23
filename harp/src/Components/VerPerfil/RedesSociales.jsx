import React, { useState } from "react";
import { ListGroup, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTiktok,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { completarRedesSociales } from "../../services/Usuario";

const SocialNetworks = ({ profileData, isMissing, onSave, sePuedeEditar }) => {
  const [editMode, setEditMode] = useState(false);
  const [localSocials, setLocalSocials] = useState({
    linkedin: profileData?.usuario?.redesSociales?.linkedin || "",
    twitter: profileData?.usuario?.redesSociales?.twitter || "",
    facebook: profileData?.usuario?.redesSociales?.facebook || "",
    instagram: profileData?.usuario?.redesSociales?.instagram || "",
    youtube: profileData?.usuario?.redesSociales?.youtube || "",
    tiktok: profileData?.usuario?.redesSociales?.tiktok || "",
  });

  const handleChange = (field, value) => {
    setLocalSocials((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const redesSociales = {
        linkedin: localSocials.linkedin,
        twitter: localSocials.twitter,
        facebook: localSocials.facebook,
        instagram: localSocials.instagram,
        youtube: localSocials.youtube,
        tiktok: localSocials.tiktok,
      };
      await completarRedesSociales(profileData?.usuario?.id, redesSociales);
      if (onSave) onSave(localSocials);
      setEditMode(false);
    } catch (error) {
      console.error("Error al completar las redes sociales:", error);
    }
  };

  const handleCancel = () => {
    setLocalSocials({
      linkedin: profileData?.usuario.redesSociales?.linkedin || "",
      twitter: profileData?.usuario.redesSociales?.twitter || "",
      facebook: profileData?.usuario.redesSociales?.facebook || "",
      instagram: profileData?.usuario.redesSociales?.instagram || "",
      youtube: profileData?.usuario.redesSociales?.youtube || "",
      tiktok: profileData?.usuario.redesSociales?.tiktok || "",
    });
    setEditMode(false);
  };

  return (
    <div className="card shadow-lg p-4 mb-4" style={{ position: "relative" }}>
      {sePuedeEditar &&
        (!editMode ? (
          <Button
            variant="light"
            className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute"
            onClick={() => setEditMode(true)}
            style={{
              background: "white",
              border: "none",
              top: "30px",
              right: "20px",
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
        Redes Sociales
      </h3>
      <ListGroup variant="flush">
        {editMode ? (
          <>
            <ListGroup.Item>
              <strong>LinkedIn: </strong>
              <Form.Control
                type="text"
                value={localSocials.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Twitter: </strong>
              <Form.Control
                type="text"
                value={localSocials.twitter}
                onChange={(e) => handleChange("twitter", e.target.value)}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Facebook: </strong>
              <Form.Control
                type="text"
                value={localSocials.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Instagram: </strong>
              <Form.Control
                type="text"
                value={localSocials.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Youtube: </strong>
              <Form.Control
                type="text"
                value={localSocials.youtube}
                onChange={(e) => handleChange("youtube", e.target.value)}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Tiktok: </strong>
              <Form.Control
                type="text"
                value={localSocials.tiktok}
                onChange={(e) => handleChange("tiktok", e.target.value)}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
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
            </ListGroup.Item>
          </>
        ) : (
          <>
            {localSocials.linkedin && (
              <ListGroup.Item>
                <a
                  href={`https://www.linkedin.com/in/${localSocials.linkedin}`}
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <strong> LinkedIn: </strong>
                {localSocials.linkedin}
              </ListGroup.Item>
            )}
            {localSocials.twitter && (
              <ListGroup.Item>
                <a
                  href={`https://www.twitter.com/${localSocials.twitter}`}
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <strong> Twitter: </strong>
                {localSocials.twitter}
              </ListGroup.Item>
            )}
            {localSocials.facebook && (
              <ListGroup.Item>
                <a
                  href={`https://www.facebook.com/${localSocials.facebook}`}
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <strong> Facebook: </strong>
                {localSocials.facebook}
              </ListGroup.Item>
            )}
            {localSocials.instagram && (
              <ListGroup.Item>
                <a
                  href={`https://www.instagram.com/${localSocials.instagram}`}
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <strong> Instagram: </strong>
                {localSocials.instagram}
              </ListGroup.Item>
            )}
            {localSocials.youtube && (
              <ListGroup.Item>
                <a
                  href={`https://www.youtube.com/@${localSocials.youtube}`}
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
                <strong> Youtube: </strong>
                {localSocials.youtube}
              </ListGroup.Item>
            )}
            {localSocials.tiktok && (
              <ListGroup.Item>
                <a
                  href={`https://www.tiktok.com/@${localSocials.tiktok}`}
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faTiktok} />
                </a>
                <strong> Tiktok: </strong>
                {localSocials.tiktok}
              </ListGroup.Item>
            )}
          </>
        )}
      </ListGroup>

      {sePuedeEditar &&
        (Object.values(localSocials).every(
          (valor) => valor == "" || valor == null
        ) || profileData?.usuario.redesSociales == null ? (
          <div
            className="alert alert-warning d-flex align-items-center"
            role="alert"
          >
            No has completado tus redes.
          </div>
        ) : (
          Object.values(localSocials).some(
            (valor) => valor == "" || valor == null
          ) && (
            <div
              className="alert alert-warning d-flex align-items-center"
              role="alert"
            >
              No has completado algunas redes.
            </div>
          )
        ))}
      {!sePuedeEditar &&
        (Object.values(localSocials).some(
          (valor) => valor == "" || valor == null
        ) ||
          profileData?.usuario.redesSociales == null) && (
          <div
            className="alert alert-warning d-flex align-items-center"
            role="alert"
          >
            No especificadas.
          </div>
        )}
    </div>
  );
};

export default SocialNetworks;
