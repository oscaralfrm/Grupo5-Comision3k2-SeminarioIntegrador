import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServicioById } from "../../../../../services/Servicio.js";

const InfoCard = ({serviceData, setServiceData}) => {
  const [showDetails, setShowDetails] = useState(true);
  const [serviceData, setServiceData] = useState(null);
  const { idServicio } = useParams();
  const {idInstructor} = useParams();
  const navigate = useNavigate();  // Hook para navegar

  const toggleDetails = () => setShowDetails(!showDetails);

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const data = await getServicioById(idServicio);
        setServiceData(data);
      } catch (error) {
        console.error('Error al traer el servicio:', error);
      }
    };
    fetchServicio();
  }, [idServicio]);

  const handleVerServicio = () => {
    // Cambiar la ruta según lo que necesites
    navigate(`/instructor/${idInstructor}/servicio/${idServicio}/info-servicio`);  // Ejemplo de ruta dinámica
  };

  //const {idServicio} = useParams();

  //const toggleDetails = () => setShowDetails(!showDetails);

  const cardStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
    maxWidth: '90%',
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
  };

  const buttonsContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  };

  return (
    <div style={cardStyle}>
      <div
        style={{
          backgroundColor: "#1E1B4B",
          borderRadius: "20px",
          padding: "20px",
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
            textAlign: "center",
            fontFamily: "Roboto",
            fontSize: "1.5rem",
          }}
        >
          {serviceData?.nombre}
        </h2>
        {showDetails &&
        <p
          style={{
            fontSize: "1em",
            color: "white",
            textAlign: "center",
            marginBottom: "0px",
          }}
        >
          {serviceData?.categoria?.nombre}
        </p>}
      </div>

      {showDetails && (
        <div style={{ textAlign: "left", marginTop: "10px" }}>
          <p>
            <strong>Ubicación:</strong> {serviceData?.ubicacion}
          </p>
          <p>
            <strong>Descripción:</strong> {serviceData?.descripcion}
          </p>
          <p>
            <strong>Tipo de Servicio:</strong> {serviceData?.categoria?.nombre}
          </p>
          <p>
            <strong>Fecha inicio:</strong> {serviceData?.fechaInicio || "Sin definir"}
          </p>
          <p>
            <strong>Modalidad de Cobro:</strong> {serviceData?.tipoFrecuenciaPago?.nombre}
          </p>
          <p>
            <strong>Inscripciones:</strong> {serviceData?.inscripcionesAbiertas === true ? "Habilitadas" : "Inhabilitadas"}
          </p>
          <p>
            <strong>Asistencias:</strong> {serviceData?.asistenciasActivas === true ? "Activas" : "Inactivas"}
          </p>
          <p>
            <strong>Clase prueba:</strong> {serviceData?.claseDePruba === true ? "Si" : "No"}
          </p>
          <p>
            <strong>Publicado:</strong> {serviceData?.publico === true ? "Si" : "No"} 
          </p>
        </div>
      )}

      <div style={buttonsContainerStyle}>
        <button onClick={toggleDetails} style={buttonStyle}>
          {showDetails ? "Ocultar Detalles" : "Mostrar Detalles"}
        </button>
        <button
          type="button"
          onClick={handleVerServicio}  // Acción de navegar
          style={{
            ...buttonStyle,
            backgroundColor: "white",
            color: "#4F46E5", 
            borderColor: "#4F46E5", 
            borderWidth: "2px",
            borderStyle: "solid",
          }}
        >
          Ver Servicio
        </button>
      </div>

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
