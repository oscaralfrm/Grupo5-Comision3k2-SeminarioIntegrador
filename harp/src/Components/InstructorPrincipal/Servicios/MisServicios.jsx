import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarInstructor from "../NavbarInstructorPrincipal/NavbarInstructorPrincipal";

const MiServicio = () => {
  const navigate = useNavigate();

  // Servicios simulados
  const servicios = [
    { id: 1, title: "Grupo 1", description: "Descripción del servicio 1" },
    { id: 2, title: "Grupo 2", description: "Descripción del servicio 2" },
    { id: 3, title: "Grupo 3", description: "Descripción del servicio 3" },
    { id: "add", title: "+", description: "Agregar" }, // Card para agregar
  ];

  const handleCardClick = (id) => {
    if (id === "add") {
      navigate(`/crear-servicio`); // Ruta para agregar un nuevo servicio
    } else {
      navigate(`/servicio/${id}`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        marginTop: "1rem",
        padding: "2rem",
        fontFamily: "Roboto",
      }}
    >
      <NavbarInstructor/>
      
      {servicios.map((servicio) => (
        <div
          key={servicio.id}
          onClick={() => handleCardClick(servicio.id)}
          style={{
            width: "20vw", // Ancho ajustado
            height: "25vh", // Altura fija
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Centra verticalmente
            alignItems: "center", // Centra horizontalmente
            margin: ".5vw",
            boxShadow: "0 0.2vw 0.4vw rgba(0, 0, 0, 0.4)", // Sombra
            cursor: "pointer",
            backgroundColor: "white", // Color de fondo
            borderRadius: "0.5rem", // Bordes redondeados
            marginTop:'15vh'
          }}
        >
          <div className="card-body" style={{ padding: "1rem", marginTop:'7vh' }}>
            <p
              className="card-title text-center"
              style={{
                margin: 0,
                fontSize: "3rem", // Aumentar el tamaño del texto
                lineHeight: 1, // Ajustar la altura de línea para centrar mejor
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
  );
};

export default MiServicio;
