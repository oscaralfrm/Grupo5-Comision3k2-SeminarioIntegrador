import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getClasesDeServicio } from "../../../../../services/Clase.js";
import { FaCalendarAlt, FaHandPointer } from "react-icons/fa";

const ClassesCard = ({ asistenciasActivas, fetchServicio }) => {
  const [classes, setClasses] = useState([]); // Contendrá todas las clases
  const [expanded, setExpanded] = useState(false);
  const { idInstructor, idServicio } = useParams();
  const navigate = useNavigate();

  // Fetching classes from the service
  useEffect(() => {
    const fetchClases = async () => {
      try {
        const data = await getClasesDeServicio(idServicio);
        // Ordenar las clases por proximidad
        const sortedClasses = data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        setClasses(sortedClasses);
      } catch (error) {
        console.error('Error al traer las clases:', error);
      }
    };
    fetchClases();
  }, [idServicio]);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  // Función para formatear la fecha y hora
  const formatClassDateTime = (clase) => {
    // Crear un objeto de fecha en la zona horaria local
    const fecha = new Date(clase.fecha + "T00:00:00"); // Añadir la hora para evitar desfases

    // Formatear la fecha en la zona horaria local
    const fechaFormateada = fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      timeZone: "UTC", // Forzar a usar UTC para evitar desfases
    });

    const diaSemana = clase.horario.diaSemana.nombre;
    const horaInicio = clase.horario.horaInicio;
    return `${diaSemana} ${fechaFormateada} a las ${horaInicio}`;
  };

  // Función para verificar si una clase es hoy
  const isToday = (clase) => {
    const today = new Date();
    const classDate = new Date(clase.fecha + "T00:00:00"); // Añadir la hora para evitar desfases
    return (
      today.getFullYear() === classDate.getFullYear() &&
      today.getMonth() === classDate.getMonth() &&
      today.getDate() === classDate.getDate()
    );
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
              {classes.slice(0, expanded ? classes.length : 3).map((cls) => {
                const todayClass = isToday(cls);
                return (
                  <div
                    key={cls.id}
                    onClick={() => todayClass && navigate(`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio/clase/${cls.id}/asistencias`)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px",
                      margin: "10px 0",
                      borderRadius: "8px",
                      backgroundColor: todayClass ? "#e0f7fa" : "#f0f0f0", // Fondo diferente para la clase de hoy
                      cursor: todayClass ? "pointer" : "default",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      border: todayClass ? "2px solid #4F46E5" : "none",
                      ":hover": todayClass ? {
                        transform: "translateY(-2px)",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      } : {}
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <FaCalendarAlt style={{ color: todayClass ? "#4F46E5" : "#666" }} />
                      <span style={{ fontWeight: todayClass ? "bold" : "normal" }}>
                        {todayClass ? "Clase de hoy: " : ""}{formatClassDateTime(cls)}
                      </span>
                    </div>
                    {todayClass && (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaHandPointer style={{ color: "#4F46E5" }} />
                        <span style={{ fontSize: "0.9em", color: "#4F46E5" }}>Tomar asistencia</span>
                      </div>
                    )}
                  </div>
                );
              })}
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
                  {expanded ? "Ver menos" : "Ver más"}
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", marginTop: "15px" }}>
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