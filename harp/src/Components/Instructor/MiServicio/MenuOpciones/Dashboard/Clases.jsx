import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Form } from "react-bootstrap";
import { getClasesDeServicio } from "../../../../../services/Clase.js";
import { activarAsistencias, desactivarAsistencias } from "../../../../../services/Servicio.js";

const ClassesCard = ({ asistenciasActivas, fetchServicio }) => {
  const [classes, setClasses] = useState([]); // Contendrá todas las clases
  const [expanded, setExpanded] = useState(false);
  const { idServicio } = useParams();

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

  const toggleAsistencias = async () => {
    const newStatus = !asistenciasActivas;
    const confirmationMessage = newStatus
      ? "¿Está seguro de que desea activar las asistencias?"
      : "¿Está seguro de que desea desactivar las asistencias?";

    if (window.confirm(confirmationMessage)) {
      try {
        newStatus
          ? await activarAsistencias(idServicio)
          : await desactivarAsistencias(idServicio);
        fetchServicio();
      } catch (error) {
        console.error("Error al cambiar el estado de las inscripciones:", error.message);
        alert(error.message); // El componente decide cómo manejar el error
      }
    }
  };

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
      maxWidth: "100%",
      width: "100%",
      fontFamily: "Roboto"
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

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexShrink: 0,
          gap: "10px",
          flexWrap: "wrap"
        }}>
          <Form>
            <Form.Check
              type="switch"
              id="inscriptions-switch"
              label={
                <span style={{ color: "white" }}>
                  {asistenciasActivas ? "Activas" : "Inactivas"}
                </span>
              }
              checked={asistenciasActivas}
              onChange={toggleAsistencias}
              style={{ margin: '0 10px' }}
            />
          </Form>
          {asistenciasActivas &&
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
          }
        </div>
      </div>

      <style>
        {`
          @media (max-width: 500px) {
            .responsive-container {
              flex-direction: column;
              align-items: center; // Alineación centrada
              text-align: center;
            }
            .responsive-container h2 {
              text-align: center;
            }
            .responsive-buttons {
              justify-content: center;
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
      ) :
        <p className="mt-3 text-center">Activa las funcionalidades del registro de asistencias de tus alumnos.</p>}
    </div>
  );
};

export default ClassesCard;