import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServicioById } from "../../../../services/Servicio";

const InfoCardAlumno = ({ serviceData, setServiceData }) => {
  const [showDetails, setShowDetails] = useState(true);
  const navigate = useNavigate();
  const {idAlumno} = useParams();

  const toggleDetails = () => setShowDetails(!showDetails);

  // Función para formatear la fecha como dd/mm/aaaa
  const formatDate = (dateString) => {
    if (!dateString) return "Sin definir";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
    maxWidth: '95%',
    minWidth: '90%',
    margin: "0 auto",
  };

  const logoStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#4a47a3",
    margin: "3vh auto",
    display: "block",
    marginTop: "0px",
  };

  const buttonStyle = {
    backgroundColor: "#4F46E5",
    color: "white",
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
  };

  const sectionStyle = {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  };

  const highlightStyle = {
    color: "#1E1B4B",
    fontWeight: "bold",
    fontSize: "1.3em", // Tamaño de letra un poco más grande
  };

  const textStyle = {
    fontSize: "1.1em", // Tamaño de letra más grande para mejor legibilidad
    margin: "5px 0",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  };

  return (
    <div style={cardStyle}>
      <div
        style={{
          backgroundColor: "#1E1B4B",
          borderRadius: "10px",
          padding: "12px",
          textAlign: "center",
        }}
      >
        {showDetails && (
          <img
            alt="Logo del servicio"
            style={logoStyle}
          />
        )}
        <h2
          style={{
            color: "white",
            fontFamily: "Roboto",
            fontSize: "1.5rem",
            margin: "10px 0",
          }}
        >
          {serviceData?.nombre}
        </h2>
        {showDetails && (
          <p
            style={{
              fontSize: "1em",
              color: "white",
              marginBottom: "0px",
            }}
          >
            {serviceData?.categoria?.nombre}
          </p>
        )}
      </div>

      {showDetails && (
        <div style={{ marginTop: "15px" }}>
          {/* Sección 1: Ubicación y descripción */}
          <div style={sectionStyle}>
            <p style={highlightStyle}>📍 Ubicación</p>
            <p style={textStyle}>{serviceData?.ubicacion}</p>
            <p style={highlightStyle}>📋 Descripción</p>
            <p style={textStyle}>{serviceData?.descripcion.substring(0, 100)}...</p>
          </div>

          {/* Sección 2: Fecha de inicio y detalles adicionales */}
          <div style={sectionStyle}>
            <p style={highlightStyle}>📅 Fecha de inicio</p>
            <p style={textStyle}>{formatDate(serviceData?.fechaInicio)}</p>
            <p style={highlightStyle}>🎯 Asistencias</p>
            <p style={textStyle}>{serviceData?.asistenciasActivas ? "🟢 Activas" : "🔴 Inactivas"}</p>
            <p style={highlightStyle}>🧪 Clase de prueba</p>
            <p style={textStyle}>{serviceData?.claseDePruba === 1 ? "🟢 Disponible" : "🔴 No disponible"}</p>
          </div>
        </div>
      )}

      <button onClick={toggleDetails} style={buttonStyle}>
        {showDetails ? "Ocultar Detalles" : "Mostrar Detalles"}
      </button>
      <button
                type="button"
                onClick={() => navigate(`/alumno/${idAlumno}/servicio/${serviceData?.id}/info-servicio`)}
                style={{
                  ...buttonStyle,
                  backgroundColor: "white",
                  color: "#4F46E5",
                  borderColor: "#4F46E5",
                  borderWidth: "2px",
                  borderStyle: "solid",
                }}
              >
                Ver más
              </button>

      <style>
        {`
          @media (max-width: 768px) {
            h2 {
              font-size: 1.5em;
            }
            p {
              font-size: 1em;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InfoCardAlumno;