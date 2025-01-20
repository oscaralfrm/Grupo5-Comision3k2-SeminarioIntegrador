import React from "react";

export default function InfoCard({ formData }) {
  return (
    <div className=" d-flex justify-content-center align-items-center ">
      <div className=" col-sm-12 p-4">
        <div
          className="card shadow-lg rounded-3 bg-light"
          style={{ transition: "0.3s" }}
        >
          {/* Encabezado de "Información Ingresada" */}
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "#1E1B4B",
              padding: "1rem",
              borderTopLeftRadius: "0.375rem",
              borderTopRightRadius: "0.375rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h1
              className="mb-3 text-center fs-1 text-white"
              style={{ fontFamily: "Roboto", fontWeight: "400" }}
            >
              Información de Cuenta
            </h1>
          </div>
          <div
            className="card-body p-4"
            style={{
              backgroundColor: "#FFFFFF", // Fondo blanco sin degradado
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Información del formulario */}
            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>Nombre: </strong>
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {formData.nombre}
              </span>
            </div>
            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>Apellido: </strong>
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {formData.apellido}
              </span>
            </div>
            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>DNI: </strong>
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {formData.dni}
              </span>
            </div>
            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>
                Nombre de usuario:{" "}
              </strong>
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {formData.nombreUsuario}
              </span>
            </div>
            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>
                Fecha de Nacimiento:{" "}
              </strong>
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {formData.fechaNacimiento}
              </span>
            </div>
            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>Email: </strong>
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {formData.email}
              </span>
            </div>
            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>Teléfono: </strong>
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {formData.telefono}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
{
    /* Estilos adicionales */
  }
  <style>
    {`
      .card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }
  
      .card-body {
        background-color: #FFFFFF; /* Fondo blanco sin degradado */
      }
  
      .card-body .mb-3 {
        padding-bottom: 1rem;
      }
  
      .card-body strong {
        font-weight: 600;
        color: #4F46E5;
      }
    `}
  </style>;
  