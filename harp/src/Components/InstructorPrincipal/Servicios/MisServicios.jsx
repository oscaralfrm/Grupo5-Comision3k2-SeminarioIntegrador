import React from "react";
import { useNavigate } from "react-router-dom";

const Servicio = () => {
  const navigate = useNavigate();
  const idInstructor = 1
  const handleCrearServicio = () => {
    navigate(`/instructor/${idInstructor}/servicio/crear-servicio`);
  };

  const servicios = [
    {
      id: 1,
      nombre: "Servicio A",
      descripcion: "Descripción del Servicio A",
      capacidadMaxima: 30,
      categoria: "Categoría 1",
    },
    {
      id: 2,
      nombre: "Servicio B",
      descripcion: "Descripción del Servicio B",
      capacidadMaxima: 20,
      categoria: "Categoría 2",
    },
  ];

  return (
    <div style={{ padding: "2vw", marginTop: "6vw" }}>
      <div style={{ display: "flex", gap: "2vw", flexWrap: "wrap" }}>
        {/* Card para crear un nuevo servicio */}
        <div
          onClick={handleCrearServicio}
          style={{
            border: "1px solid #ccc",
            borderRadius: "1vw",
            padding: "2vw",
            width: "20vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 0.2vw 0.4vw rgba(0, 0, 0, 0.1)",
            transition: "box-shadow 0.3s ease",
            fontSize: "3vw",
            color: "#007bff",
            fontWeight: "bold",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0.5vw 1vw rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0.2vw 0.4vw rgba(0, 0, 0, 0.1)";
          }}
        >
          +
        </div>

        {/* Cards de servicios existentes */}
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "1vw",
              padding: "1vw",
              width: "20vw",
              boxShadow: "0 0.2vw 0.4vw rgba(0, 0, 0, 0.1)",
              transition: "box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0.5vw 1vw rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0.2vw 0.4vw rgba(0, 0, 0, 0.1)";
            }}
          >
            <h3 style={{ fontSize: "1.2vw" }}>{servicio.nombre}</h3>
            <p style={{ fontSize: "1vw" }}>{servicio.descripcion}</p>
            <p style={{ fontSize: "1vw" }}>Capacidad máxima: {servicio.capacidadMaxima} alumnos</p>
            <p style={{ fontSize: "1vw" }}>Categoría: {servicio.categoria}</p>
            <button
              onClick={() => navigate(`/servicio/${servicio.id}`)}
              style={{
                marginTop: "1rem",
                padding: "0.5vw 1vw",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "0.5vw",
                cursor: "pointer",
                fontSize: "1vw",
              }}
            >
              Ir a Servicio
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servicio;
