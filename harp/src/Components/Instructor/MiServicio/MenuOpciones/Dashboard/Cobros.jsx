import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { traerUltimasCuotasDeServicio } from "../../../../../services/Cuota";
import { getServicioById } from "../../../../../services/Servicio";

const Cobros = () => {
  const [showAllPending, setShowAllPending] = useState(false);
  const [showLatePayments, setShowLatePayments] = useState(false);
  const navigate = useNavigate();
  const [cuotas, setCuotas] = useState([]); // Lista completa de cuotas
  const [servicio, setServicio] = useState(null); // Detalle del servicio
  const { idServicio } = useParams();

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

  useEffect(() => {
    const fetchCuotas = async () => {
      try {
        const data = await traerUltimasCuotasDeServicio(idServicio);
        setCuotas(data);
      } catch (error) {
        console.error("Error al traer las cuotas:", error);
      }
    };
    fetchCuotas();
  }, [idServicio]);

  const cuotasConEstadoActual = cuotas.map(([alumno, cuotas]) => [
    alumno,
    cuotas.map((cuota) => ({
      ...cuota,
      cambiosEstado: cuota.cambiosEstado.filter((estado) => estado.fechaFin === null),
    })),
  ]);

  const cuotasPendientes = cuotasConEstadoActual
    .map(([alumno, cuotas]) => [
      alumno,
      cuotas.filter((cuota) =>
        cuota.cambiosEstado.some((estado) => estado.estadoCuota === "Pendiente")
      ),
    ])
    .filter(([_, cuotas]) => cuotas.length > 0);

  const cuotasVencidas = cuotasConEstadoActual
    .map(([alumno, cuotas]) => [
      alumno,
      cuotas.filter((cuota) =>
        cuota.cambiosEstado.some((estado) => estado.estadoCuota === "Vencida")
      ),
    ])
    .filter(([_, cuotas]) => cuotas.length > 0);

  const handleGoToPayments = (idAlumno) => {
    navigate(`/cobros?alumno=${idAlumno}`);
  };

  const handleGoToStudent = (idAlumno) => {
    navigate(`/alumnos/${idAlumno}`);
  };

  const toggleShowAllPending = () => setShowAllPending((prev) => !prev);

  const toggleShowLatePayments = () => setShowLatePayments((prev) => !prev);

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

      <style>
        {`
          @media (max-width: 768px) {
            .header-container {
              justify-content: center; /* Centrar contenido en móviles */
              flex-direction: column; /* Cambiar a columna en móviles */
              align-items: center; /* Centrar ambos elementos */
            }

            .header-container button {
              margin-top: 10px; /* Margen superior para el botón en móvil */
              width: 100%; /* Hacer que el botón ocupe todo el ancho en móvil */
              max-width: 200px; /* Opcional: Máximo ancho para el botón */
            }
          }

          .section h3 {
            margin-top: 20px; /* Aumenta el margen superior para el título de sección */
          }

          .highlight {
            background-color: #dc3545 !important;
            color: white !important;
            border-radius: 50%;
          }
        `}
      </style>

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

      <hr />
      <div className="section">
        <h3 style={{ color: "#1E1B4B", fontSize: "1.4rem" }}>Calendario de Pagos</h3>
        <Calendar tileClassName={tileClassName} />
      </div>
    </div>
  );
};

export default Cobros;