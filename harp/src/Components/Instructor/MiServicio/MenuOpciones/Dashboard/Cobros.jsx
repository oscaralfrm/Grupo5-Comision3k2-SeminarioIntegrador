import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {obtenerCuotasDeInscripcion,} from "../../../../../services/Cuota"; // Asegúrate de importar los servicios correctamente
import {getHistorialCuotasDeAlumno, getInscripcionesDeAlumno, getAlumnosDeGrupo} from "../../../../../services/Alumno"
import { getServicioById } from "../../../../../services/Servicio";
import {getGruposDeServicio} from "../../../../../services/Grupo"

const Cobros = () => {
  const [showAllPending, setShowAllPending] = useState(false);
  const [showLatePayments, setShowLatePayments] = useState(false);
  const navigate = useNavigate();
  const [cuotas, setCuotas] = useState([]);
  const [servicio, setServicio] = useState(null);
  const { idServicio } = useParams();

  // Obtener el servicio
  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const data = await getServicioById(idServicio);
        setServicio(data);
      } catch (error) {
        console.error("Error al traer el servicio:", error);
      }
    };
    fetchServicio();
  }, [idServicio]);

  // Obtener las inscripciones y cuotas asociadas
  useEffect(() => {
    const fetchInscripcionesYCuotas = async () => {
      try {
        // Obtener grupos del servicio
        const grupos = await getGruposDeServicio(idServicio);

        // Obtener alumnos y cuotas para cada grupo
        const cuotasData = [];
        for (const grupo of grupos) {
          const alumnos = await getAlumnosDeGrupo(idServicio, grupo.id); // Obtener alumnos del grupo
          for (const alumno of alumnos) {
            const inscripciones = await getInscripcionesDeAlumno(alumno.id); // Obtener inscripciones del alumno
            for (const inscripcion of inscripciones) {
              const cuotasInscripcion = await obtenerCuotasDeInscripcion(idServicio, inscripcion.id);
              cuotasData.push([alumno, cuotasInscripcion]);
            }
          }
        }

        setCuotas(cuotasData);
      } catch (error) {
        console.error("Error al traer las cuotas:", error);
      }
    };
    fetchInscripcionesYCuotas();
  }, [idServicio]);

  // Procesar cuotas con estado actual
  const cuotasConEstadoActual = cuotas.map(([alumno, cuotas]) => [
    alumno,
    cuotas.map((cuota) => ({
      ...cuota,
      cambiosEstado: cuota.cambiosEstado.filter((estado) => estado.fechaFin === null),
    })),
  ]);

  // Filtrar cuotas pendientes
  const cuotasPendientes = cuotasConEstadoActual
    .map(([alumno, cuotas]) => [
      alumno,
      cuotas.filter((cuota) =>
        cuota.cambiosEstado.some((estado) => estado.estadoCuota === "Pendiente")
      ),
    ])
    .filter(([_, cuotas]) => cuotas.length > 0);

  // Filtrar cuotas vencidas
  const cuotasVencidas = cuotasConEstadoActual
    .map(([alumno, cuotas]) => [
      alumno,
      cuotas.filter((cuota) =>
        cuota.cambiosEstado.some((estado) => estado.estadoCuota === "Vencida")
      ),
    ])
    .filter(([_, cuotas]) => cuotas.length > 0);

  // Navegar a la página de pagos
  const handleGoToPayments = (idAlumno) => {
    navigate(`/cobros?alumno=${idAlumno}`);
  };

  // Navegar a la página del alumno
  const handleGoToStudent = (idAlumno) => {
    navigate(`/alumnos/${idAlumno}`);
  };

  // Alternar visibilidad de cuotas pendientes
  const toggleShowAllPending = () => setShowAllPending((prev) => !prev);

  // Alternar visibilidad de pagos atrasados
  const toggleShowLatePayments = () => setShowLatePayments((prev) => !prev);

  // Estilo para resaltar el día límite de pago en el calendario
  const tileClassName = ({ date, view }) => {
    if (view === "month" && servicio?.diaLimitePago && date.getDate() === servicio.diaLimitePago) {
      return "highlight";
    }
    return null;
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
        maxWidth: "90%",
        margin: "auto",
      }}
      className="responsive-container"
    >
      {/* Encabezado */}
      <div
        className="header-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          backgroundColor: "#1E1B4B",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <h2 style={{ color: "white", fontFamily: "Roboto", fontSize: "1.5rem", margin: 0 }}>Cobros</h2>
        <button
          onClick={() => navigate(`/instructor/1/servicio/${idServicio}/cobros`)}
          style={{
            backgroundColor: "#4F46E5",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            marginLeft: "10px",
          }}
          className="go-to-payments-button"
        >
          Ir a Cobros
        </button>
      </div>

      {/* Estilos adicionales */}
      <style>
        {`
          @media (max-width: 768px) {
            .header-container {
              justify-content: center;
              flex-direction: column;
              align-items: center;
            }

            .header-container button {
              margin-top: 10px;
              width: 100%;
              max-width: 200px;
            }
          }

          .section h3 {
            margin-top: 20px;
          }

          .highlight {
            background-color: #dc3545 !important;
            color: white !important;
            border-radius: 50%;
          }
        `}
      </style>

      {/* Sección de alumnos con pago pendiente */}
      <div className="section">
        <h3 style={{ color: "#1E1B4B", fontSize: "1.4rem" }}>Alumnos con Pago Pendiente</h3>
        <hr />
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cuotasPendientes
            .slice(0, showAllPending ? cuotasPendientes.length : 3)
            .map(([alumno, cuotas]) => (
              <li key={alumno.id} style={{ marginBottom: "10px" }}>
                <span>{alumno.usuario.nombre}</span>
                <button
                  onClick={() => handleGoToPayments(alumno.id)}
                  style={{
                    backgroundColor: "#4F46E5",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  Ver
                </button>
              </li>
            ))}
        </ul>
      </div>

      {/* Sección de pagos atrasados */}
      {cuotasVencidas.length > 0 && (
        <div className="section">
          <button
            onClick={toggleShowLatePayments}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            {showLatePayments ? (
              <>
                <FaChevronUp /> Ocultar Pagos Atrasados
              </>
            ) : (
              <>
                <FaChevronDown /> Mostrar Pagos Atrasados
              </>
            )}
          </button>
          {showLatePayments && (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {cuotasVencidas.map(([alumno]) => (
                <li key={alumno.id} style={{ marginBottom: "10px" }}>
                  <button
                    onClick={() => handleGoToStudent(alumno.id)}
                    style={{
                      backgroundColor: "#ffcccc",
                      color: "#dc3545",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    {alumno.usuario.nombre}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Sección del calendario de pagos */}
      <hr />
      <div className="section">
        <h3 style={{ color: "#1E1B4B", fontSize: "1.4rem" }}>Calendario de Pagos</h3>
        <Calendar tileClassName={tileClassName} />
      </div>
    </div>
  );
};

export default Cobros;