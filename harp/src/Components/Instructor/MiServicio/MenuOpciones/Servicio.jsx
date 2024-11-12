import React from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para manejar la navegación
import InfoCard from "../MenuOpciones/Dashboard/InfoServicio";
import GroupSection from "../MenuOpciones/Dashboard/Grupos";
import ReviewCarousel from "../MenuOpciones/Dashboard/Reseñas";
import Enrollments from "../MenuOpciones/Dashboard/Inscripciones";
import Cobros from "../MenuOpciones/Dashboard/Cobros";
import StudentsCard from "../MenuOpciones/Dashboard/Alumnos";

const Servicio = () => {
  const navigate = useNavigate(); // Declara navigate para utilizarlo en el botón

  const handleNavigate = () => {
    navigate("/instructor/1/servicios");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Roboto", color: "#1E1B4B", marginTop: "2vh", position: "relative" }}>
      {/* Botón "Mis Servicio" en la esquina superior derecha */}
      <button
        onClick={handleNavigate}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          fontSize: "16px",
          backgroundColor: "#1E1B4B",
          color: "#ffffff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Mis Servicios
      </button>

      <h1 style={{ color: "#1E1B4B", fontWeight: "bold", textAlign: "center" }}>
        Mi Servicio
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "auto auto auto auto",
          gap: "20px",
          maxWidth: "100%",
        }}
      >
        {/* Columna izquierda - Información del servicio */}
        <div
          style={{
            gridColumn: "1 / 2",
            gridRow: "1 / 5",
            fontFamily: "Roboto",
            margin: "0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginTop: "5vh"
          }}
        >
          <InfoCard />
          <StudentsCard />
        </div>

        {/* Columna central - Inscripciones */}
        <div
          style={{
            gridColumn: "2 / 3",
            gridRow: "1 / 2",
            padding: "0",
            margin: "0",
            fontFamily: "Roboto",
            marginTop: "5vh"
          }}
        >
          <Enrollments />
        </div>

        {/* Columna derecha - Cobros */}
        <div
          style={{
            gridColumn: "3 / 4",
            gridRow: "1 / 2",
            fontFamily: "Roboto",
            marginTop: "5vh"
          }}
        >
          <Cobros />
        </div>
      </div>
    </div>
  );
};

export default Servicio;
