import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarInstructor from "../NavbarInstructorPrincipal/NavbarInstructorPrincipal";

const MiServicio = () => {
  const navigate = useNavigate();

  // Servicios simulados
  const servicios = [
    { id: "add", title: "+", description: "Agregar" }, // Card para agregar
  ];

  const handleCardClick = (id) => {
    if (id === "add") {
      navigate(`/crear-servicio`); // Ruta para agregar un nuevo servicio
    } else {
      navigate(`/servicio/${id}`);
    }
  };
  const Nombre = "YOGA";

  return (
    <div style={{ fontFamily: "Roboto" }}>
      <NavbarInstructor />
      <h1
        style={{
          fontFamily: "Roboto",
          marginTop: "15vh",
          display: "flex",
          justifyContent: "center", // Centrado horizontal
          alignItems: "center", // Centrado vertical si fuera necesario
          fontSize: "4rem",
          textAlign: "center", // Alineación central
        }}
      >
        {Nombre}
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          marginTop: "2rem",
          padding: "2rem",
        }}
      >
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            onClick={() => handleCardClick(servicio.id)}
            style={{
              width: "20vw", // Ancho ajustado
              height: "25vh", // Altura fija
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: ".5vw",
              boxShadow: "0 0.2vw 0.4vw rgba(0, 0, 0, 0.4)", // Sombra
              cursor: "pointer",
              backgroundColor: "white", // Color de fondo
              borderRadius: "0.5rem", // Bordes redondeados
            }}
          >
            <div className="card-body" style={{ padding: "1rem" }}>
              <p
                className="card-title text-center"
                style={{
                  margin: 0,
                  fontSize: "3rem",
                  lineHeight: 1,
                }}
              >
                {servicio.title}
              </p>
              <p className="card-text text-center" style={{ margin: 0 }}>
                {servicio.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiServicio;
