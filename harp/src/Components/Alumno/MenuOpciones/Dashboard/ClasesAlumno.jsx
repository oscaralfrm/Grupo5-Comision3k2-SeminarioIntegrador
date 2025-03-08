import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getClasesFuturasDeGrupo, getClasesDeGrupo, getGruposDeServicio } from "../../../../services/Grupo";
import { useNavigate } from "react-router-dom";
import { getResumenAsistencias } from "../../../../services/Inscripcion";

const ClassesCardAlumno = ({ asistenciasActivas, servicio, grupoId }) => {
  const [classes, setClasses] = useState([]); // Clases totales
  const [clasesFuturas, setClasesFuturas] = useState([]); // Clases futuras
  const [expanded, setExpanded] = useState(false);
  const [clasesCompletadas, setClasesCompletadas] = useState(0);
  const [servicioIniciado, setServicioIniciado] = useState(false);
  const [fechaInicioServicio, setFechaInicioServicio] = useState(null);
  const [claseHoy, setClaseHoy] = useState(null); // Clase del día actual
  const { idAlumno, idInscripcion } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      console.log("Datos del servicio:", servicio);
      const fechaInicio = new Date(servicio?.fechaInicio);
      setFechaInicioServicio(fechaInicio);
      setServicioIniciado(fechaInicio <= new Date());

      let clasesTotales = [];
      let clasesFuturas = [];

      // Obtener clases del grupo
      const clasesGrupo = await getClasesDeGrupo(grupoId);
      clasesTotales.push(...clasesGrupo);

      // Obtener clases futuras del grupo
      const futurasClases = await getClasesFuturasDeGrupo(grupoId);
      clasesFuturas.push(...futurasClases);

      // Filtrar clases futuras que no estén marcadas como "noFueDada"
      const clasesFuturasFiltradas = clasesFuturas.filter(cls => !cls.noFueDada);

      // Calcular clases completadas
      const resumen = await getResumenAsistencias(idInscripcion);
      setClasesCompletadas(resumen.cantAsistencias || 0);

      // Ordenar clases futuras de más cercana a más lejana
      const clasesFuturasOrdenadas = clasesFuturasFiltradas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setClasesFuturas(clasesFuturasOrdenadas);

      // Actualizar estados
      setClasses(clasesTotales);

      // Encontrar la clase del día actual (excluyendo las marcadas como "noFueDada")
      const claseDeHoy = clasesTotales.find(cls => isToday(cls) && !cls.noFueDada);
      setClaseHoy(claseDeHoy);

    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [grupoId]);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  const handleNavigate = () => {
    navigate(`/alumno/${idAlumno}/inscripciones/${idInscripcion}/mi-inscripcion/asistencias`);
  };

  // Función para formatear la fecha y hora de las clases
  const formatearClase = (clase) => {
    const fecha = new Date(clase.fecha + "T00:00:00"); // Añadir la hora para evitar desfases
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

    // Comparar solo el día, mes y año
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
      maxWidth: "95%",
      width: "100%",
      margin: "0.5vh auto",
    }}>
      {/* Encabezado */}
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
          <button
            onClick={handleNavigate}
            style={{
              backgroundColor: "#4F46E5",
              color: "white",
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Historial
          </button>
        )}
      </div>

      {/* Información general del servicio */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "15px",
        textAlign: "center",
        padding: "0 10px", // Reducir el espacio interno
        gap: "-50px"
      }}>
        <div>
          <p style={{ margin: 0, fontSize: "0.9em" }}>Estado del servicio</p>
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "1em" }}>
            {servicioIniciado ? "Activo" : "Por comenzar"}
          </p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "0.9em" }}>Clases completadas</p>
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "1em" }}>
            {clasesCompletadas}
          </p>
        </div>
      </div>

      {asistenciasActivas ? (
        <>
          {/* Clase del día actual */}
          <div style={{
            marginTop: "20px",
            textAlign: "center",
            padding: "15px",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px"
          }}>
            <h3 style={{ fontSize: "1.2em", marginBottom: "10px" }}>Clase de Hoy</h3>
            {claseHoy ? (
              <p style={{ fontSize: "1.1em", fontWeight: "bold", color: "#4F46E5" }}>
                {formatearClase(claseHoy)}
              </p>
            ) : (
              <p style={{ fontSize: "1.1em", color: "#666" }}>No hay clases hoy</p>
            )}
          </div>

          {/* Clases futuras */}
          {clasesFuturas.length > 0 && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <h3 style={{ fontSize: "1.2em", marginBottom: "10px" }}>Proximas Clases</h3>
              {clasesFuturas.slice(0, expanded ? clasesFuturas.length : 3).map((cls) => (
                <div key={cls.id} style={{
                  padding: "10px 0",
                  borderBottom: "1px solid #ccc",
                  textAlign: "center"
                }}>
                  <p style={{ fontSize: "1em", margin: 0 }}>
                    {formatearClase(cls)}
                  </p>
                </div>
              ))}

              {/* Botón para expandir */}
              {clasesFuturas.length > 3 && (
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
                    {expanded ? "Ver menos" : "Ver todas"}
                  </button>
                </div>
              )}
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