import React from "react";
import { FaUser, FaIdCard, FaBirthdayCake, FaPhone, FaEnvelope, FaUserCircle } from "react-icons/fa";
import img from "../../../../assets/profile.png"

const formatDate = (dateString) => {
  if (!dateString) return ""; // Si no hay fecha, retornar un string vacío
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

export default function InfoCard({ formData }) {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="col-sm-12 p-4">
        <div
          className="card shadow-lg rounded-3 bg-light"
          style={{ transition: "0.3s" }}
        >
          {/* Franja azul con el nombre y la foto de perfil */}
          <div
            className="d-flex justify-content-between align-items-center p-3"
            style={{
              backgroundColor: "#1E1B4B",
              borderTopLeftRadius: "0.375rem",
              borderTopRightRadius: "0.375rem",
            }}
          >
            {/* Nombre y Apellido */}
            <div className="d-flex align-items-center">
              <FaUser className="me-2 text-white" style={{ fontSize: "1.5rem" }} />
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "500",
                  color: "#FFFFFF",
                  margin: 0,
                }}
              >
                {formData.nombre || ""} {formData.apellido || ""}
              </h2>
            </div>

            {/* Foto de perfil */}
            <div
              className="rounded-circle overflow-hidden"
              style={{ width: "80px", height: "80px", border: "3px solid #FFFFFF" }}
            >
              <img
                src={formData.fotoPerfil || img}
                alt="Foto de perfil"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Cuerpo de la tarjeta */}
          <div
            className="card-body p-4"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Información del formulario */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <FaIdCard className="me-3" style={{ color: "#4F46E5", fontSize: "1.5rem" }} />
                  <div>
                    <strong style={{ fontSize: "1.2rem" }}>DNI: </strong>
                    <span style={{ fontSize: "1.1rem", color: "#333", display: "block" }}>
                      {formData.dni || ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <FaBirthdayCake className="me-3" style={{ color: "#4F46E5", fontSize: "1.5rem" }} />
                  <div>
                    <strong style={{ fontSize: "1.2rem", whiteSpace: "nowrap" }}>Fecha de Nacimiento: </strong>
                    <span style={{ fontSize: "1.1rem", color: "#333", display: "block" }}>
                      {formatDate(formData.fechaNacimiento)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <FaPhone className="me-3" style={{ color: "#4F46E5", fontSize: "1.5rem" }} />
                  <div>
                    <strong style={{ fontSize: "1.2rem" }}>Teléfono: </strong>
                    <span style={{ fontSize: "1.1rem", color: "#333", display: "block" }}>
                      {formData.telefono || ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <FaUserCircle className="me-3" style={{ color: "#4F46E5", fontSize: "1.5rem" }} />
                  <div>
                    <strong style={{ fontSize: "1.2rem" }}>Nombre de usuario: </strong>
                    <span style={{ fontSize: "1.1rem", color: "#333", display: "block" }}>
                      {formData.nombreUsuario || ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <FaEnvelope className="me-3" style={{ color: "#4F46E5", fontSize: "1.5rem", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ fontSize: "1.2rem" }}>Email: </strong>
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        display: "block",
                        whiteSpace: "normal", // Permite múltiples líneas
                        wordBreak: "break-word", // Rompe palabras largas si es necesario
                      }}
                    >
                      {formData.email || ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}