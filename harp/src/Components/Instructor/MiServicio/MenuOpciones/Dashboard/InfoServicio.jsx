import React, { useState } from "react";
import ReviewCarousel from "./Reseñas";
import { useNavigate } from "react-router-dom";

const InfoCard = () => {
  const [showDetails, setShowDetails] = useState(true);

  const toggleDetails = () => setShowDetails(!showDetails);
  const navigate = useNavigate;

  const onSubmit = async () => { 
    //alert("Formulario enviado con éxito");
    //console.log(data); // Aquí puedes manejar el envío de los datos
    
    // Asumiendo que `idInstructor` e `idServicio` vienen de `data`
    const { idInstructor, idServicio } = data;
    //navigate(`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`);
    navigate(`/instructor/1/servicio/1/mi-servicio`)
  };

  // Simulación de los datos del servicio
  const serviceData = {
    name: "Yoga",
    category: "Salud y Bienestar",
    location: "Ciudad Cordoba, Calle Alcorta 123",
    description: "Clases personalizadas de yoga para todas las edades.",
    serviceType: "Presencial",
    paymentMode: "Mensual",
    attendance: "Sí",
    freePass: "No",
    published: "Sí",
    logoUrl: "https://via.placeholder.com/80", // URL de la imagen del logo
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
    maxWidth:'90%',
    minWidth:'90%',
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
      {/* Contenedor con margen superior */}
      <div
        style={{
          backgroundColor: "#1E1B4B",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        {showDetails && (
          <img
            src={serviceData.logoUrl}
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
          {serviceData.name}
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
          {serviceData.category}
        </p>}
      </div>

      {showDetails && (
        <div style={{ textAlign: "left", marginTop: "10px" }}>
          <p>
            <strong>Ubicación:</strong> {serviceData.location}
          </p>
          <p>
            <strong>Descripción:</strong> {serviceData.description}
          </p>
          <p>
            <strong>Tipo de Servicio:</strong> {serviceData.serviceType}
          </p>
          <p>
            <strong>Modalidad de Cobro:</strong> {serviceData.paymentMode}
          </p>
          <p>
            <strong>Asistencias:</strong> {serviceData.attendance}
          </p>
          <p>
            <strong>Pase Libre:</strong> {serviceData.freePass}
          </p>
          <p>
            <strong>Publicado:</strong> {serviceData.published}
          </p>
        </div>
      )}

      <div style={buttonsContainerStyle}>
        <button onClick={toggleDetails} style={buttonStyle}>
          {showDetails ? "Ocultar Detalles" : "Mostrar Detalles"}
        </button>
        <button
          type = "submit"
          style={{
            ...buttonStyle,
            backgroundColor: "white",
            color: "#4F46E5", // Color del texto
            borderColor: "#4F46E5", // Color del borde
            borderWidth: "2px", // Puedes ajustar el grosor del borde si es necesario
            borderStyle: "solid", // Definir el estilo del borde (opcional, pero recomendado)
          }}
        >
          Editar
        </button>
      </div>

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
