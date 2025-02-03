import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { obtenerCuotasDeInscripcion } from "../../../../services/Cuota";
import { getMontoActualGrupo, getHistorialMontosGrupo } from "../../../../services/HistorialMontoCuota";
import { getServicioById } from "../../../../services/Servicio";
import { getInscripcionesDeAlumno } from "../../../../services/Alumno"; // Asegúrate de tener importado este servicio
import { getMontosProgramadosDeHistorial } from "../../../../services/HistorialMontoCuota";

const Pagos = (props) => {
  const { handleAddPayment } = props; 
  const [showAllPending, setShowAllPending] = useState(false);
  const [showLatePayments, setShowLatePayments] = useState(false);
  const navigate = useNavigate();
  const [cuotas, setCuotas] = useState([]); // Lista completa de cuotas
  const [montoActual, setMontoActual] = useState(null); // Monto actual del grupo
  const [historialMontos, setHistorialMontos] = useState([]); // Historial de montos
  const [servicio, setServicio] = useState(null); // Detalle del servicio
  const [inscripcionId, setInscripcionId] = useState(null); // ID de la inscripción
  const [grupoId, setGrupoId] = useState(null); // ID del grupo
  const { idAlumno } = useParams();
  const { idServicio } = useParams();
  const [proximoMonto, setProximoMonto] = useState(null);
  const [fechaVigencia, setFechaVigencia] = useState(null);
  const [fechaVigenciaProximoMonto, setFechaVigenciaProximoMonto] = useState(null);


  useEffect(() => {
    const fetchServicio = async () => {
      try {
        console.log("Fetching servicio...");
        const data = await getServicioById(idServicio);
        console.log("Servicio obtenido: ", data);
        setServicio(data);
      } catch (error) {
        console.error("Error al traer el servicio:", error);
      }
    };
    fetchServicio();
  }, [idServicio]);

  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        const inscripciones = await getInscripcionesDeAlumno(idAlumno); // Traemos las inscripciones del alumno
        console.log("Inscripciones obtenidas: ", inscripciones);
        if (inscripciones.length > 0) {
          // Asumimos que la primera inscripción es la correcta
          const inscripcion = inscripciones[0];
          setInscripcionId(inscripcion.id);
          setGrupoId(inscripcion.grupo.id);
        }
      } catch (error) {
        console.error("Error al obtener las inscripciones:", error);
      }
    };
    fetchInscripciones();
  }, [idServicio]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inscripciones = await getInscripcionesDeAlumno(idAlumno);
        if (inscripciones.length > 0) {
          setInscripcionId(inscripciones[0].id);
          setGrupoId(inscripciones[0].grupo.id);
        }
      } catch (error) {
        console.error("Error al obtener inscripciones:", error);
      }
    };
    fetchData();
  }, [idAlumno]);

  useEffect(() => {
    const fetchMontos = async () => {
      try {
        if (grupoId) {
          // Obtener el monto actual y la fecha de vigencia
          const montoActualData = await getMontoActualGrupo(idServicio, grupoId);
          const montoActual = montoActualData ? montoActualData.monto : null;
          const fechaInicio = montoActualData ? montoActualData.fechaInicio : null;
  
          // Actualiza el estado con el monto actual
          setMontoActual(montoActual);
          setFechaVigencia(fechaInicio);
          console.log("Monto actual:", montoActual); // Monto actual del grupo
          console.log("Fecha de vigencia actual:", fechaInicio); // Fecha de vigencia del monto actual
  
          // Obtener el historial de montos para ver los montos futuros
          const historial = await getHistorialMontosGrupo(idServicio, grupoId);
          setHistorialMontos(historial);
          console.log("Historial: ", historial);
  
          // Buscar el próximo monto programado en el historial
          const montosFuturos = getMontosProgramadosDeHistorial(historial);
          if (montosFuturos.length > 0) {
            const siguienteMonto = montosFuturos.reduce((min, current) =>
              new Date(current.fechaInicio) < new Date(min.fechaInicio) ? current : min
            );
            const siguienteMonto1 = siguienteMonto ? siguienteMonto.monto : null;
            const fechaInicioProximoMonto = siguienteMonto ? siguienteMonto.fechaInicio : null;
  
            // Actualiza el estado con el próximo monto y su fecha de vigencia
            setProximoMonto(siguienteMonto1);
            setFechaVigenciaProximoMonto(fechaInicioProximoMonto); // Guarda la fecha de vigencia del próximo monto
  
            console.log("Siguiente Monto: ", siguienteMonto1);
            console.log("Fecha de vigencia del próximo monto:", fechaInicioProximoMonto);
          } else {
            setProximoMonto(null);
            setFechaVigenciaProximoMonto(null); // No hay próximo monto, limpiar la fecha de vigencia
          }
        }
      } catch (error) {
        console.error("Error al obtener montos:", error);
      }
    };
  
    if (grupoId) fetchMontos();
  }, [idServicio, grupoId]);
  
// Revisión automática cada minuto
useEffect(() => {
  const interval = setInterval(() => {
    if (proximoMonto && new Date(fechaVigenciaProximoMonto) <= new Date()) {
      setMontoActual(proximoMonto); // Aplica el próximo monto al monto actual
      setFechaVigencia(fechaVigenciaProximoMonto); // Actualiza la fecha de vigencia con la fecha de inicio del próximo monto
      setProximoMonto(null); // Elimina el monto programado después de aplicarlo
      setFechaVigenciaProximoMonto(null); // Limpia la fecha de vigencia del próximo monto
    }
  }, 1); // Cada 60 segundos

  return () => clearInterval(interval);
}, [proximoMonto, fechaVigenciaProximoMonto]); // Dependencias actualizadas
  



  useEffect(() => {
    const fetchCuotas = async () => {
      try {
        if (inscripcionId) {
          const data = await obtenerCuotasDeInscripcion(idServicio, inscripcionId);
          console.log("Cuotas obtenidas:", data);
          setCuotas(data);
  
          // Asumiendo que el montoServicio está relacionado con el grupo
          /* if (data.length > 0) {
            const montoData = data[0]?.montoServicio; // Asegúrate de que 'montoServicio' esté presente
            setMontoActual(montoData?.monto || "Monto no disponible");
          } */
        }
      } catch (error) {
        console.error("Error al traer las cuotas:", error);
      }
    };
    if (inscripcionId) {
      fetchCuotas();
    }
  }, [idServicio, inscripcionId]);
  
  console.log('Estructura de cuotas:', cuotas);

const cuotasConEstadoActual = Array.isArray(cuotas) && cuotas.length > 0 ? cuotas.map((cuota) => {
  if (!Array.isArray(cuota.cambiosEstado)) {
    console.log('Error: cambiosEstado no es un arreglo en cuota:', cuota);
  }
  return {
    ...cuota,
    cambiosEstado: Array.isArray(cuota.cambiosEstado) ? cuota.cambiosEstado.filter((estado) => estado.fechaFin === null) : [],
  };
}) : [];

console.log('Cuotas con estado actual:', cuotasConEstadoActual);


const cuotasPendientes = Array.isArray(cuotasConEstadoActual) ? cuotasConEstadoActual.filter((cuota) =>
  Array.isArray(cuota.cambiosEstado) && cuota.cambiosEstado.some((estado) => estado.estadoCuota === "Pendiente")
) : [];

const cuotasVencidas = Array.isArray(cuotasConEstadoActual) ? cuotasConEstadoActual.filter((cuota) =>
  Array.isArray(cuota.cambiosEstado) && cuota.cambiosEstado.some((estado) => estado.estadoCuota === "Vencida")
) : [];

console.log(cuotas); // Verifica que es un arreglo
console.log(cuotasConEstadoActual); // Verifica que es un arreglo después del primer mapeo
console.log("Cuotas Pendientes", cuotasPendientes); // Verifica el filtro de cuotas pendientes
console.log(cuotasVencidas); // Verifica el filtro de cuotas vencidas


  
  const handleGoToPayments = () => {
    console.log("Navigating to payments...");
    navigate(`/alumno/${inscripcionId}/pagos`);
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month" && servicio?.diaLimitePago && date.getDate() === servicio.diaLimitePago) {
      return "highlight-day";
    }
    return null;
  };

  console.log("ID del servicio:", idServicio);
  console.log("ID de la inscripción:", inscripcionId);
  console.log("ID del grupo:", grupoId);
  console.log("Estructura de cuotas:", cuotas);


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
        <h2 style={{ color: "white", fontFamily: "Roboto", fontSize: "1.5rem", margin: 0 }}>Mis Pagos</h2>
        <button
          onClick={handleGoToPayments}
          style={{
            backgroundColor: "#4F46E5",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          Ir a Pagos
        </button>
      </div>

      <div className="section">
        <h3 style={{ color: "#1E1B4B", fontSize: "1.4rem", marginTop: "10px" }}>Precio Actual</h3>
        <p style={{ fontWeight: "bold" }}>{montoActual ? `$${montoActual}` : "Cargando monto..."}</p>
      </div>
      <hr />

      <div className="section">
  <h3 style={{ color: "#1E1B4B", fontSize: "1.4rem" }}>Actualizacion de Precios</h3>
  {proximoMonto ? (
    <div style={{ backgroundColor: "#FFF3CD", padding: "10px", borderRadius: "8px", borderLeft: "5px solid #D97706", marginBottom: "10px" }}>
      <p style={{ color: "#D97706", fontWeight: "bold", margin: 0 }}>
        ⚠️ Desde el <strong>{new Date(fechaVigenciaProximoMonto).toLocaleDateString("es-ES")}</strong>, el monto será de
        <strong> ${proximoMonto}</strong>.
      </p>
    </div>
  ) : (
    <p style={{ color: "#6B7280", fontStyle: "italic", textAlign: "center" }}>
      ❌ Todavía no hay un nuevo monto programado.
    </p>
  )}
</div>
<hr />



      <div className="section">
  <h3 style={{ color: "#1E1B4B", fontSize: "1.4rem" }}>Cuotas Pendientes</h3>
  <ul style={{ listStyle: "none", padding: 0 }}>
    {cuotasPendientes
      .slice(0, showAllPending ? cuotasPendientes.length : 3)
      .map((item) => (
        <li key={item.id} style={{ marginBottom: "10px" }}>
          <span>{`Hay una cuota pendiente con fecha límite de pago: ${item.fechaLimitePago}`}</span>
          <button
            onClick={() => handleAddPayment(idAlumno, cuotasPendientes)}
            style={{
              backgroundColor: "#28a745", // Cambiado a verde
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "10px",
            }}
          >
            Pagar
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
                    onClick={() => handleGoToPayments(alumno.id)}
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

      {/* Estilos para el día límite de pago */}
      <style>
        {`
          .highlight-day {
            background-color: #ffcccc;
            border-radius: 50%;
            color: #dc3545;
          }
        `}
      </style>
    </div>
  );
};

export default Pagos;
