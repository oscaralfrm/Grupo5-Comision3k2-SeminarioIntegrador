import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServicioById } from "../../../../../services/Servicio.js";
import { FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaUserCheck, FaClipboardCheck, FaEye, FaEyeSlash, FaCog } from "react-icons/fa";

const InfoCard = ({ serviceData, setServiceData }) => {
  const [showDetails, setShowDetails] = useState(true);
  const { idServicio } = useParams();
  const { idInstructor } = useParams();
  const navigate = useNavigate();

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
    navigate(`/instructor/${idInstructor}/servicio/${idServicio}/configurar`);
  };

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

  const sectionStyle = {
    marginBottom: "15px",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0", // Fondo más oscuro para resaltar las secciones
  };

  const iconStyle = {
    marginRight: "8px",
    verticalAlign: "middle",
    color: "#4F46E5", // Color para los iconos
  };

  return (
    <div style={cardStyle}>
      <div
        style={{
          backgroundColor: "#1E1B4B",
          borderRadius: "10px",
          padding: "12px",
        }}
      >
        {showDetails && (
          <img
            alt="Logo del servicio"
            style={{
              ...logoStyle,
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "50%",
              display: "block",
              margin: "0 auto",
            }}
            src={serviceData?.logoURL}
          />
        )}
        <h2
          style={{
            color: "white",
            textAlign: "center",
            justifyContent: "center",
            fontFamily: "Roboto",
            fontSize: "1.5rem",
          }}
        >
          {serviceData?.nombre}
        </h2>
        {showDetails && (
          <p
            style={{
              fontSize: "1em",
              color: "white",
              textAlign: "center",
              marginBottom: "0px",
            }}
          >
            {serviceData?.categoria?.nombre}
          </p>
        )}
      </div>

      {showDetails && (
        <div style={{ marginTop: "10px" }}>
          <div style={sectionStyle}>
            <p>
              <FaMapMarkerAlt style={iconStyle} />
              <strong>Ubicación:</strong> {serviceData?.ubicacion}
            </p>
            <p>
              <FaCalendarAlt style={iconStyle} />
              <strong>Fecha inicio:</strong>{" "}
              {serviceData?.fechaInicio || "Sin definir"}
            </p>
          </div>

          <div style={sectionStyle}>
            <p>
              <FaUserCheck style={iconStyle} />
              <strong>Inscripciones:</strong>{" "}
              {serviceData?.inscripcionesAbiertas
                ? "Habilitadas"
                : "Inhabilitadas"}
            </p>
            <p>
              <FaClipboardCheck style={iconStyle} />
              <strong>Asistencias:</strong>{" "}
              {serviceData?.asistenciasActivas ? "Activas" : "Inactivas"}
            </p>
            <p>
              <FaEye style={iconStyle} />
              <strong>Clase prueba:</strong>{" "}
              {serviceData?.claseDePruba ? "Si" : "No"}
            </p>
            <p>
              <FaEyeSlash style={iconStyle} />
              <strong>Publicado:</strong> {serviceData?.publico ? "Si" : "No"}
            </p>
          </div>
        </div>
      )}

      <div style={buttonsContainerStyle}>
        <button onClick={toggleDetails} style={buttonStyle}>
          {showDetails ? "Ocultar Detalles" : "Mostrar Detalles"}
        </button>
        <button
          type="button"
          onClick={handleVerServicio}
          style={{
            ...buttonStyle,
            backgroundColor: "white",
            color: "#4F46E5",
            borderColor: "#4F46E5",
            borderWidth: "2px",
            borderStyle: "solid",
          }}
        >
          <FaCog style={iconStyle} />
          Configurar
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