import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getClasesDeServicio } from "../../../../services/Clase";
import { getServicioById } from "../../../../services/Servicio";

const ClassesCardAlumno = ({ asistenciasActivas }) => {
  const [classes, setClasses] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [clasesCompletadas, setClasesCompletadas] = useState(0);
  const [servicioIniciado, setServicioIniciado] = useState(false);
  const [fechaInicioServicio, setFechaInicioServicio] = useState(null);
  const { idServicio } = useParams();

  useEffect(() => {
    const fetchClases = async () => {
      try {
        console.log("Obteniendo clases del servicio con ID:", idServicio);
        const data = await getClasesDeServicio(idServicio);
        console.log("Clases obtenidas:", data);
        setClasses(data);

        const today = new Date();
        let completadas = 0;

        data.forEach(cls => {
          const fechaClase = new Date(cls.fecha);
          if (fechaClase < today) {
            completadas += 1;
          }
        });

        console.log("Clases completadas:", completadas);
        setClasesCompletadas(completadas);

      } catch (error) {
        console.error("Error al traer las clases:", error);
      }
    };

    const fetchServicio = async () => {
      try {
        console.log("Obteniendo datos del servicio con ID:", idServicio);
        const servicio = await getServicioById(idServicio);
        console.log("Datos del servicio obtenidos:", servicio);

        const fechaInicio = new Date(servicio.fechaInicio);
        setFechaInicioServicio(fechaInicio);
        setServicioIniciado(fechaInicio <= new Date());
        console.log("Fecha de inicio del servicio:", fechaInicio);
        console.log("¿El servicio ya comenzó?", fechaInicio <= new Date());

      } catch (error) {
        console.error("Error al obtener el servicio:", error);
      }
    };

    fetchClases();
    fetchServicio();
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

      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <p>Clases completadas: {clasesCompletadas} / {classes.length}</p>
        <p>Estado del curso: {servicioIniciado ? "Activo" : "Por comenzar"}</p>
      </div>

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
      ) : (
        <p className="mt-3 text-center">Activa las funcionalidades del registro de asistencias de tus alumnos.</p>
      )}
    </div>
  );
};

export default ClassesCardAlumno;
