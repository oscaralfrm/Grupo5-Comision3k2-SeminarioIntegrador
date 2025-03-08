import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { obtenerCuotasDeInscripcion, obtenerUltimasCuotasDeInscripcion } from "../../../../services/Cuota";
import { getHistorialMontosGrupo, getMontoActualGrupoDeHistorial } from "../../../../services/HistorialMontoCuota";
import { getMontoProgramadoDeHistorial } from "../../../../services/HistorialMontoCuota";
import { getServicioById } from "../../../../services/Servicio";
import ModalPagarCuotaConComprobante from "../../ModalPagarCuotaConComprobante";
import CuotaCard from "../../ResumenCuota";

const Pagos = (props) => {
  const { idServicio, grupo } = props;
  const { idInscripcion } = useParams();
  const [showAllPending, setShowAllPending] = useState(false);
  const [showLatePayments, setShowLatePayments] = useState(false);
  const navigate = useNavigate();
  const [cuotas, setCuotas] = useState([]); // Lista completa de cuotas
  const [cuotasPendientes, setCuotasPendientes] = useState([]); // Lista completa de cuotas
  const [cuotasVencidas, setCuotasVencidas] = useState([]); // Lista completa de cuotas
  const [cuotasConEstadoActual, setCuotasConEstadoActual] = useState([]); // Lista completa de cuotas

  const [montoActual, setMontoActual] = useState(null); // Monto actual del grupo
  const [servicio, setServicio] = useState(null); // Detalle del servicio
  const { idAlumno } = useParams();
  const [proximoMonto, setProximoMonto] = useState(null);
  const [fechaVigencia, setFechaVigencia] = useState(null);
  const [fechaVigenciaProximoMonto, setFechaVigenciaProximoMonto] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCuota, setSelectedCuota] = useState(null);
  const [showAddPayment, setShowAddPayment] = useState(false);

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

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
    const fetchMontos = async () => {
      try {
        if (grupo.id) {
          // Obtener el monto actual y la fecha de vigencia
          const montoActualData = await getMontoActualGrupoDeHistorial(grupo.historialMontos);
          console.log("Monto actual del grupo:", montoActualData); // Depuración

          // Actualiza el estado con el monto actual
          setMontoActual(montoActualData?.monto);
          setFechaVigencia(parseDate(montoActualData?.fechaInicio));

          // Buscar el próximo monto programado en el historial
          const montosFuturos = getMontoProgramadoDeHistorial(grupo.historialMontos);
          const siguienteMonto = montosFuturos.length > 0 ? montosFuturos[0].monto : null;
          const fechaInicioProximoMonto = siguienteMonto ? parseDate(siguienteMonto.fechaInicio) : null; // Parsear la fecha correctamente

          // Actualiza el estado con el próximo monto y su fecha de vigencia
          setProximoMonto(siguienteMonto);
          setFechaVigenciaProximoMonto(fechaInicioProximoMonto);

          console.log("Siguiente Monto: ", siguienteMonto); // Depuración
          console.log("Fecha de vigencia del próximo monto:", fechaInicioProximoMonto); // Depuración
        }
      } catch (error) {
        console.error("Error al obtener montos:", error);
      }
    };

    if (grupo?.id) fetchMontos();
  }, [idServicio, idInscripcion]);


  /*
  // Revisión automática cada minuto para actualizar el monto cuando llegue la fecha de vigencia
  useEffect(() => {
    const interval = setInterval(() => {
      const fechaActual = new Date();
      const fechaVigenciaProximoMontoDate = new Date(fechaVigenciaProximoMonto);
   
      // Convertir ambas fechas a UTC para evitar problemas de zona horaria
      const fechaActualUTC = new Date(
        Date.UTC(
          fechaActual.getFullYear(),
          fechaActual.getMonth(),
          fechaActual.getDate()
        )
      );
      const fechaVigenciaUTC = new Date(
        Date.UTC(
          fechaVigenciaProximoMontoDate.getFullYear(),
          fechaVigenciaProximoMontoDate.getMonth(),
          fechaVigenciaProximoMontoDate.getDate()
        )
      );
   
      // Comparar solo el día, mes y año, ignorando la hora
      const isSameDate =
        fechaActualUTC.getTime() === fechaVigenciaUTC.getTime();
   
      if (proximoMonto && isSameDate) {
        setMontoActual(proximoMonto); // Aplica el próximo monto al monto actual
        setFechaVigencia(fechaVigenciaProximoMonto); // Actualiza la fecha de vigencia
        setProximoMonto(null); // Elimina el monto programado después de aplicarlo
        setFechaVigenciaProximoMonto(null); // Limpia la fecha de vigencia del próximo monto
      }
    }, 1000); // Revisa cada 60 segundos
   
    return () => clearInterval(interval);
  }, [proximoMonto, fechaVigenciaProximoMonto]);
  */

  const fetchCuotas = async () => {
    try {
      if (idInscripcion) {
        const data = await obtenerUltimasCuotasDeInscripcion(idServicio, idInscripcion);
        console.log("Cuotas obtenidas:", data);
        setCuotas(data);

        // Asumiendo que el montoServicio está relacionado con el grupo
        /* if (data.length > 0) {
          const montoData = data[0]?.montoServicio; // Asegúrate de que 'montoServicio' esté presente
          setMontoActual(montoData?.monto || "Monto no disponible");
        } */
      }

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

      setCuotasConEstadoActual(cuotasConEstadoActual);
      console.log('Cuotas con estado actual:', cuotasConEstadoActual);


      const cuotasPendientes = Array.isArray(cuotasConEstadoActual) ? cuotasConEstadoActual.filter((cuota) =>
        Array.isArray(cuota.cambiosEstado) && cuota.cambiosEstado.some((estado) => estado.estadoCuota === "Pendiente")
      ) : [];
      setCuotasPendientes(cuotasPendientes);

      const cuotasVencidas = Array.isArray(cuotasConEstadoActual) ? cuotasConEstadoActual.filter((cuota) =>
        Array.isArray(cuota.cambiosEstado) && cuota.cambiosEstado.some((estado) => estado.estadoCuota === "Vencida")
      ) : [];
      setCuotasVencidas(cuotasVencidas);

      console.log(cuotas); // Verifica que es un arreglo
      console.log(cuotasConEstadoActual); // Verifica que es un arreglo después del primer mapeo
      console.log("Cuotas Pendientes", cuotasPendientes); // Verifica el filtro de cuotas pendientes
      console.log(cuotasVencidas); // Verifica el filtro de cuotas vencidas

    } catch (error) {
      console.error("Error al traer las cuotas:", error);
    }
  };

  useEffect(() => {
    if (idInscripcion) {
      fetchCuotas();
    }
  }, [idServicio, idInscripcion]);

  const handleAddPayment = (cuota) => {
    setSelectedCuota(cuota);
    setShowAddPayment(true);
  };

  const handleGoToPayments = () => {
    console.log("Navigating to payments...");
    navigate(`/alumno/${idAlumno}/inscripciones/pagos`);
  };

  

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
        maxWidth: "95%",
        margin: "auto",
        fontFamily:"Roboto"
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
        <hr />
        <h3 style={{ color: "#1E1B4B", fontSize: "1.4rem" }}>Cuotas Pendientes</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cuotas
            .slice(0, showAllPending ? cuotasPendientes.length : 3)
            .map((cuota) => (
              <li key={cuota.id} style={{ marginBottom: "10px" }}>
                <CuotaCard cuota={cuota} idInscripcion={idInscripcion} idServicio={idServicio} grupo={grupo} fetchCuotas={fetchCuotas}/>
              </li>
            ))}
        </ul>
      </div>


      <div className="section">
        <h3 style={{ color: "#1E1B4B", fontSize: "1.4rem", marginTop: "10px" }}>Precio Actual</h3>
        <p style={{ fontWeight: "bold" }}>
          {montoActual !== null && montoActual !== undefined ? `$${montoActual}` : "No disponible"}
        </p>
      </div>

      {proximoMonto && (
        <div className="section">
          <h3 style={{ color: "#1E1B4B", fontSize: "1.4rem" }}>Actualizacion de Precios</h3>
          <div style={{ backgroundColor: "#FFF3CD", padding: "10px", borderRadius: "8px", borderLeft: "5px solid #D97706", marginBottom: "10px" }}>
            <p style={{ color: "#D97706", fontWeight: "bold", margin: 0 }}>
              ⚠️ Desde el <strong>{new Date(fechaVigenciaProximoMonto).toLocaleDateString("es-ES")}</strong>, el precio será de
              <strong> ${proximoMonto}</strong>.
            </p>
          </div>
        </div>
      )}

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

      {/* Estilos para el día límite de pago */}
      <style>
        {`
          .highlight {
            background-color: #dc3545 !important;
            color: white !important;
            border-radius: 50%;
          }
        `}
      </style>

<div className="section">
        <hr />
        <h3 style={{ color: "#1E1B4B", fontSize: "1.4rem" }}>Calendario de Pagos</h3>
        <Calendar tileClassName={tileClassName} />
      </div>


      <ModalPagarCuotaConComprobante
        showAddPayment={showAddPayment}
        handleCloseAddPayment={() => setShowAddPayment(false)}
        selectedCuota={selectedCuota}
        fetchCuotas={fetchCuotas}
        idServicio={idServicio}
      />
    </div>


  );
};

export default Pagos;