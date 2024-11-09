import React, { useState } from "react";

const InfoCard = () => {
  const [showDetails, setShowDetails] = useState(true);
  
  const toggleDetails = () => setShowDetails(!showDetails);

  const cardStyle = {
    backgroundColor: "#eef2ff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "100%",
    margin: "0 auto",
  };

  const logoStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#4a47a3",
    margin: "0 auto",
    display: "block",
  };

  const buttonStyle = {
    backgroundColor: "#4a47a3",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    marginTop: "10px",
    cursor: "pointer",
  };

  return (
    <div style={cardStyle}>
      <img src="logo_url_aqui" alt="Logo del servicio" style={logoStyle} />
      <h2 style={{ color: "#4a47a3", textAlign: "center" }}>Nombre del Servicio</h2>
      <p style={{ fontSize: "16px", color: "#666", textAlign: "center" }}>Categoría del Servicio</p>

      {showDetails && (
        <div>
          <p><strong>Ubicación:</strong> Ciudad, Dirección</p>
          <p><strong>Descripción:</strong> Descripción breve del servicio...</p>
          <p><strong>Tipo de Servicio:</strong> Presencial / Online</p>
          <p><strong>Modalidad de Cobro:</strong> Mensual</p>
          <p><strong>Asistencias:</strong> Sí</p>
          <p><strong>Pase Libre:</strong> No</p>
          <p><strong>Publicado:</strong> Sí</p>
        </div>
      )}

      <button onClick={toggleDetails} style={buttonStyle}>
        {showDetails ? "Ocultar Detalles" : "Mostrar Detalles"}
      </button>
      <button style={{ ...buttonStyle, backgroundColor: "#6a67d1", marginLeft: "10px" }}>
        Editar
      </button>

      {/* Responsive adjustments */}
      <style>
        {`
          @media (max-width: 768px) {
            h2 {
              font-size: 1.5em;
            }
            p {
              font-size: 1em;
            }
            button {
              width: 100%;
              margin-top: 10px;
            }
          }

          @media (min-width: 769px) {
            .container {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InfoCard;
