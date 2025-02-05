import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getClasesFuturasDeGrupo, getClasesDeGrupo, getGruposDeServicio } from "../../../../services/Grupo";
import { getServicioById } from "../../../../services/Servicio";
import { getInscripcionesDeGrupo } from "../../../../services/Inscripcion";
import { useNavigate } from "react-router-dom";

const ClassesCardAlumno = ({ asistenciasActivas }) => {
  const [classes, setClasses] = useState([]); // Clases totales
  const [clasesFuturas, setClasesFuturas] = useState([]); // Clases futuras
  const [expanded, setExpanded] = useState(false);
  const [clasesCompletadas, setClasesCompletadas] = useState(0);
  const [servicioIniciado, setServicioIniciado] = useState(false);
  const [fechaInicioServicio, setFechaInicioServicio] = useState(null);
  const [inscripciones, setInscripciones] = useState([]); // Inscripciones totales
  const [claseHoy, setClaseHoy] = useState(null); // Clase del día actual
  const {idAlumno} = useParams();
  const navigate = useNavigate();

  const { idServicio } = useParams();

  const fetchData = async () => {
    try {
      console.log("Obteniendo datos del servicio con ID:", idServicio);

      // Obtener servicio
      const servicio = await getServicioById(idServicio);
      console.log("Datos del servicio:", servicio);
      const fechaInicio = new Date(servicio.fechaInicio);
      setFechaInicioServicio(fechaInicio);
      setServicioIniciado(fechaInicio <= new Date());

      // Obtener grupos del servicio
      const grupos = await getGruposDeServicio(idServicio);
      console.log("Grupos obtenidos:", grupos);

      let clasesTotales = [];
      let clasesFuturas = [];
      let inscripcionesTotales = [];

      for (const grupo of grupos) {
        const idGrupo = grupo.id;

        // Obtener clases del grupo
        const clasesGrupo = await getClasesDeGrupo(idGrupo);
        clasesTotales.push(...clasesGrupo);

        // Obtener clases futuras del grupo
        const futurasClases = await getClasesFuturasDeGrupo(idGrupo);
        clasesFuturas.push(...futurasClases);

        // Obtener inscripciones del grupo
        const inscripcionesGrupo = await getInscripcionesDeGrupo(idServicio, idGrupo, true, false);
        inscripcionesTotales.push(...inscripcionesGrupo);
      }

      console.log("Clases obtenidas:", clasesTotales);
      console.log("Clases futuras:", clasesFuturas);
      console.log("Inscripciones totales:", inscripcionesTotales);

      // Calcular clases completadas
      const hoy = new Date();
      const completadas = clasesTotales.filter(cls => new Date(cls.fecha) < hoy).length;
      setClasesCompletadas(completadas);

      // Ordenar clases futuras de más cercana a más lejana
      const clasesFuturasOrdenadas = clasesFuturas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setClasesFuturas(clasesFuturasOrdenadas);

      // Actualizar estados
      setClasses(clasesTotales);
      setInscripciones(inscripcionesTotales);

      // Encontrar la clase del día actual
      const claseDeHoy = clasesTotales.find(cls => {
        const fechaClase = new Date(cls.fecha);
        return fechaClase.toDateString() === hoy.toDateString();
      });
      setClaseHoy(claseDeHoy);

    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idServicio]);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  const handleNavigate = () => {
    navigate(`/alumno/${idAlumno}/servicios/${idServicio}/mi-servicio/asistencias`);
};

  // Función para formatear la fecha y hora de las clases
  const formatearClase = (clase) => {
    const fecha = new Date(clase.fecha);
    const diaSemana = clase.horario.diaSemana.nombre;
    const hora = clase.horario.horaInicio;
    return `${diaSemana} ${fecha.getDate()} a las ${hora}`;
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
        <div>
          <p style={{ margin: 0, fontSize: "0.9em" }}>Numero de inscriptos</p>
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "1em" }}>
            {inscripciones.length}
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