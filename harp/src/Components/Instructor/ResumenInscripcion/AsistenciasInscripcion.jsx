import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AsistenciasInscripcion = ({ inscripcion, resumenAsistencias }) => {
    const navigate = useNavigate();
    const {idInstructor} = useParams();

  // Calculamos totales y porcentajes
  const total = resumenAsistencias
    ? resumenAsistencias.cantidadAsistencias + resumenAsistencias.cantidadInasistencias
    : 0;
  const percentAsistencias = total
    ? Math.round((resumenAsistencias.cantidadAsistencias / total) * 100)
    : 0;
  const percentInasistencias = total ? 100 - percentAsistencias : 0;

  return (
    <div
      className="card shadow-lg p-4 mb-4"
      style={{ position: "relative", fontFamily: "Roboto" }}
    >
        <Button
      variant="primary"
      onClick={() => navigate(`/instructor/${idInstructor}/servicio/${inscripcion.id}`)}
      style={{
        position: "absolute",
        top: "15px",
        right: "15px",
        backgroundColor: "#6a5acd", // Color violeta que estás usando
        borderColor: "#6a5acd",
      }}
    >
      Asistencias
    </Button>
      <h3 style={{ color: "#6a5acd" }}>Asistencias</h3>
      <hr />
      {resumenAsistencias ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Columna del gráfico de barras y leyenda */}
          <div style={{ flex: 1, marginRight: "20px" }}>
            {/* Gráfico de barras horizontal */}
            <div style={{ marginBottom: "10px" }}>
              <div
                style={{
                  display: "flex",
                  height: "20px",
                  width: "100%",
                  background: "#e9ecef",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                {/* Asistencias (tono violeta) */}
                <div
                  style={{
                    width: `${percentAsistencias}%`,
                    background: "#6A0DAD",
                  }}
                ></div>
                {/* Inasistencias (tono celeste/azul) */}
                <div
                  style={{
                    width: `${percentInasistencias}%`,
                    background: "#6495ED",
                  }}
                ></div>
              </div>
            </div>
            {/* Leyenda con los conteos */}
            <div style={{ fontSize: "0.9rem" }}>
              <span style={{ color: "#6A0DAD", fontWeight: "bold" }}>
                Asistencias: {resumenAsistencias.cantidadAsistencias}
              </span>
              <br />
              <span style={{ color: "#6495ED", fontWeight: "bold" }}>
                Inasistencias: {resumenAsistencias.cantidadInasistencias}
              </span>
            </div>
          </div>
          {/* Columna con el porcentaje grande */}
          <div style={{ width: "100px", textAlign: "center" }}>
            <span
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#6A0DAD",
              }}
            >
              {percentAsistencias}%
            </span>
            <br />
            <span style={{ fontSize: "0.8rem" }}>Asistencia</span>
          </div>
        </div>
      ) : (
        <div
          className="alert alert-warning d-flex align-items-center"
          role="alert"
        >
          No hay información de asistencias disponible.
        </div>
      )}
    </div>
  );
};

export default AsistenciasInscripcion;
