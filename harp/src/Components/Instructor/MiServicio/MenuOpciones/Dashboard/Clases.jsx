import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getClasesDeServicio } from "../../../../../services/Clase.js";

const ClassesCard = ({ asistenciasActivas, fetchServicio }) => {
  const [classes, setClasses] = useState([]); // Contendrá todas las clases
  const [expanded, setExpanded] = useState(false);
  const { idInstructor, idServicio } = useParams();
  const navegate = useNavigate();
  // Fetching classes from the service
  useEffect(() => {
    const fetchClases = async () => {
      try {
        const data = await getClasesDeServicio(idServicio);
        setClasses(data);
      } catch (error) {
        console.error('Error al traer las clases:', error);
      }
    };
    fetchClases();
  }, [idServicio]);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div style={{
      position: "relative",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
        maxWidth: "90%",
        width: "90%",
        margin: "0.5vh auto",
    }}>
      <div className="responsive-container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1E1B4B",
        borderRadius: "10px",
        width: "100%",
        padding: "10px",
        flexWrap: "wrap"
      }}>
        <h2 style={{
          color: "white",
          fontFamily: "Roboto",
          fontSize: "1.5em",
          margin: 0,
          flex: 1,
          textAlign: "left"
        }}>Clases</h2>

        {asistenciasActivas && (
          <Link to="" style={{
            backgroundColor: "#4F46E5",
            color: "white",
            padding: "10px 20px",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "14px"
          }}>
            Historial
          </Link>
        )}
      </div>

      <style>
        {`
          @media (max-width: 500px) {
            .responsive-container {
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .responsive-container h2 {
              text-align: center;
            }
          }
        `}
      </style>

      {asistenciasActivas ? (
        <>
          {classes.length > 0 ? (
            <>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
                flexDirection: "column",
                textAlign: "center"
              }}>
                <span>Fecha</span>
                <span>Dia</span>
                <span>Hora</span>
              </div>
              <hr />
              {classes.slice(0, expanded ? classes.length : 1).map((cls) => (
                <div
                  key={cls.id}
                  onClick={()=>navegate(`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio/clase/${cls.id}/asistencias`)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    cursor: "pointer",
                    color: "inherit",
                    borderBottom: "1px solid #ccc",
                    flexDirection: "column",
                    textAlign: "center"
                  }}
                >
                  <span>{cls.fecha}</span>
                  <span>{cls.observaciones}</span>
                  <span>{cls.horario.diaSemana.nombre}</span>
                  <span>{cls.horario.horaInicio}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
                <button onClick={handleExpandToggle} style={{
                  backgroundColor: "#4F46E5",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer"
                }}>
                  {expanded ? "Ver menos" : "Ver todos"}
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p>No hay clases disponibles</p>
            </div>
          )}
        </>
      ) : (
        <p className="mt-3 text-center">Activa las funcionalidades del registro de asistencias de tus alumnos.</p>
      )}
    </div>
  );
};

export default ClassesCard;
