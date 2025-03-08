import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getGruposDeServicio, getClasesDeGrupo, getGrupoById } from "../../../../../services/Grupo.js";
import { FaCalendarAlt, FaHandPointer } from "react-icons/fa";
import { Button } from 'react-bootstrap';

const ClassesCard = ({ asistenciasActivas, fetchServicio }) => {
  const [groupedClasses, setGroupedClasses] = useState({}); // Clases agrupadas por grupo
  const [expanded, setExpanded] = useState(false); // Estado para controlar si se muestran todas las clases
  const { idInstructor, idServicio } = useParams();
  const navigate = useNavigate();

  // Fetching grupos and their classes
  useEffect(() => {
    const fetchGruposYClases = async () => {
      try {
        // Obtener los grupos del servicio
        const grupos = await getGruposDeServicio(idServicio);

        // Objeto para agrupar las clases por grupo
        const grouped = {};

        // Recorrer cada grupo y obtener sus clases
        for (const grupo of grupos) {
          const clases = await getClasesDeGrupo(grupo.id);

          // Filtrar las clases que no estén marcadas como "noFueDada"
          const clasesFiltradas = clases.filter(cls => !cls.noFueDada);

          // Ordenar las clases por fecha (de más reciente a más lejana)
          const sortedClases = clasesFiltradas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

          // Obtener el nombre del grupo
          const grupoInfo = await getGrupoById(grupo.id);

          // Agregar las clases al grupo correspondiente
          grouped[grupo.id] = {
            nombre: grupoInfo.nombre,
            clases: sortedClases,
          };
        }

        setGroupedClasses(grouped);
      } catch (error) {
        console.error('Error al traer los grupos y clases:', error);
      }
    };

    fetchGruposYClases();
  }, [idServicio]);

  // Función para manejar la expansión de todas las clases
  const handleExpandToggle = () => {
    setExpanded(!expanded); // Cambiar el estado de expansión
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

  const handleNavigate = () => {
    // Navega a la ruta deseada
    navigate(`/instructor/${idInstructor}/servicio/${idServicio}/historial-clases`);
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
          <Button
            onClick={handleNavigate} // Usa onClick en lugar de to
            style={{
              backgroundColor: "#4F46E5",
              color: "white",
              padding: "10px 20px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "14px",
              border: "none", // Elimina el borde por defecto de Button
              cursor: "pointer", // Cambia el cursor a pointer
            }}
          >
            Historial
          </Button>
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
          {Object.keys(groupedClasses).length > 0 ? (
            <>
              {Object.keys(groupedClasses).map((grupoId) => {
                const grupo = groupedClasses[grupoId];
                return (
                  <div key={grupoId} style={{ marginBottom: "20px", marginTop: "20px" }}>
                    {/* Título de la sección del grupo */}
                    <h3 style={{
                      backgroundColor: "rgba(30, 27, 75, 0.9)", // Fondo más oscuro con opacidad
                      padding: "10px",
                      borderRadius: "8px",
                      color: "white",
                      textAlign: "center", // Centrar el texto
                      marginBottom: "15px", // Separación del contenido debajo
                      fontFamily: "Roboto",
                      fontSize: "1.2em",
                    }}>
                      Grupo: {grupo.nombre}
                    </h3>

                    {/* Clases del grupo */}
                    {(expanded ? grupo.clases : grupo.clases.slice(0, 1)).map((cls) => {
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
                  </div>
                );
              })}

              {/* Botón "Ver más" o "Ver menos" */}
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