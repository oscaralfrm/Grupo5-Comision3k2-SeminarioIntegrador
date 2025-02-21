// components/Profile/ProfileInfo.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getInstructorById } from "../../../services/Instructor";
import { getAlumnoById, getInscripcionesVigentesDeAlumno } from "../../../services/Alumno";
import { getReseniasDeAlumnoYServicioFiltradas } from "../../../services/Reseñas";
import { obtenerCuotasDeInscripcion, obtenerUltimasCuotasDeInscripcion } from "../../../services/Cuota";
import PhotoProfile from "../../VerPerfil/FotoPerfilSeccion";
import InscripcionData from "./DatosInscripcion";
import Biography from "../../VerPerfil/Biografia";
import ReviewCarousel from "../MiServicio/MenuOpciones/Dashboard/Reseñas";
import ServiciosCardRow from "../../VerPerfil/ResumenUsuario/CarruselServicios";
import SocialNetworks from "../../VerPerfil/RedesSociales";
import { calcularAntiguedadComoTexto } from "../MiServicio/MenuOpciones/Dashboard/Inscripciones";
import { getResumenAsistencias, getHistorialAsistencias, getResumenPagosDeInscripcion, traerUnaInscripcion } from "../../../services/Inscripcion";
import AsistenciasInscripcion from "./AsistenciasInscripcion";
import CuotasInscripcion from "./CuotasInscripcion";
import FinalizarInscripcionModal from "./ModalFinalizarInscripcion";

{/* resumenAsistencias = { cantAsistencias: 10, cantInasistencias: 5} 
    cuotas = [  {
                                "id": 21,
                                "montoServicio": {
                                  "id": 68,
                                  "monto": 25,
                                  "fechaInicio": "2025-02-03",
                                  "fechaFin": null
                                },
                                "recargo": 500,
                                "fechaInicioCiclo": "2025-02-06",
                                "fechaFinCiclo": "2025-03-06",
                                "fechaLimitePago": "2025-02-06",
                                "cambiosEstado": [
                                  {
                                    "id": 32,
                                    "fechaInicio": "2025-02-06",
                                    "fechaFin": "2025-02-07",
                                    "estadoCuota": "Pendiente"
                                  },
                                  {
                                    "id": 41,
                                    "fechaInicio": "2025-02-07",
                                    "fechaFin": null,
                                    "estadoCuota": "Abonada"
                                  }
                                ],
                                "pago": {
                                  "id": 17,
                                  "metodoPago": {
                                    "id": 2,
                                    "nombre": "Transferencia"
                                  },
                                  "fechaPago": "2025-02-07",
                                  "comprobanteURL": null,
                                  "rechazado": false,
                                  "fechaRechazo": null,
                                  "motivoRechazo": null
                                }
                              },   {
                                "id": 21,
                                "montoServicio": {
                                  "id": 68,
                                  "monto": 25,
                                  "fechaInicio": "2025-02-03",
                                  "fechaFin": null
                                },
                                "recargo": 500,
                                "fechaInicioCiclo": "2025-02-06",
                                "fechaFinCiclo": "2025-03-06",
                                "fechaLimitePago": "2025-02-06",
                                "cambiosEstado": [
                                  {
                                    "id": 32,
                                    "fechaInicio": "2025-02-06",
                                    "fechaFin": "2025-02-07",
                                    "estadoCuota": "Pendiente"
                                  },
                                  {
                                    "id": 41,
                                    "fechaInicio": "2025-02-07",
                                    "fechaFin": null,
                                    "estadoCuota": "Vencida"
                                  }
                                ],
                                "pago": {
                                  "id": 17,
                                  "metodoPago": {
                                    "id": 2,
                                    "nombre": "Transferencia"
                                  },
                                  "fechaPago": "2025-02-07",
                                  "comprobanteURL": null,
                                  "rechazado": false,
                                  "fechaRechazo": null,
                                  "motivoRechazo": null
                                }
                              },   {
                                "id": 21,
                                "montoServicio": {
                                  "id": 68,
                                  "monto": 25,
                                  "fechaInicio": "2025-02-03",
                                  "fechaFin": null
                                },
                                "recargo": 500,
                                "fechaInicioCiclo": "2025-02-06",
                                "fechaFinCiclo": "2025-03-06",
                                "fechaLimitePago": "2025-02-06",
                                "cambiosEstado": [
                                  {
                                    "id": 32,
                                    "fechaInicio": "2025-02-06",
                                    "fechaFin":null,
                                    "estadoCuota": "Pendiente"
                                  },
                                
                                ],
                                "pago": {
                                  "id": 17,
                                  "metodoPago": {
                                    "id": 2,
                                    "nombre": "Transferencia"
                                  },
                                  "fechaPago": "2025-02-07",
                                  "comprobanteURL": null,
                                  "rechazado": false,
                                  "fechaRechazo": null,
                                  "motivoRechazo": null
                                }
                              }, ]


                           resumenPagos =   {cantCuotasAbonadas: 10, cantCuotasVencidas: 5, cantCuotasTotales: 10, demoraPromedioPago: 25, porcentajeVencimientos: 32}
    
    */}

const ResumenInscripcion = () => {
  const { idInscripcion, idInstructor, idServicio } = useParams();
  const navigate = useNavigate();
  const [inscripcion, setInscripcion] = useState(null);
  const [alumno, setAlumno] = useState(null);
  const [grupo, setGrupo] = useState(null);
  const [resumenAsistencias, setResumenAsistencias] = useState(null);
  const [historialAsistencias, setHistorialAsistencias] = useState([]);
  const [ultimasCuotas, setUltimasCuotas] = useState([]);
  const [historialCuotas, setHistorialCuotas] = useState([]);
  const [resumenPagos, setResumenPagos] = useState(null);
  const [cantInscripciones, setCantInscripciones] = useState(null);
  const [resenias, setResenias] = useState([]);
  const [error, setError] = useState(null);

  // Estado para controlar el modal de finalización
  const [showFinalizarModal, setShowFinalizarModal] = useState(false);

  // Detectar si es desktop para estilos
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchInscripcion = async () => {
      try {
        // LA INSCRIPCION
        const inscripcion = await traerUnaInscripcion(idInscripcion);
        setInscripcion(inscripcion);
        console.log("Inscripcion", inscripcion);

        setAlumno(inscripcion.alumno);
        setGrupo(inscripcion.grupo);

        const alumnoId = inscripcion?.alumno?.id;
        const servicioId = inscripcion?.servicio?.id;
        const grupoId = inscripcion?.grupo?.id;

        //const alumnoData = await getAlumnoById(alumnoId);
        //setProfileData(alumnoData);

        // OTRAS INSCRIPCIONES
        //const inscripciones = await getInscripcionesVigentesDeAlumno(alumnoId);
        //setCantInscripciones(inscripciones.length);

        // RESENIAS DEL SERVICIO
        const resenias = await getReseniasDeAlumnoYServicioFiltradas(alumnoId, servicioId, true, false);
        setResenias(resenias);

        // ASISTENCIAS
        const resumenData = await getResumenAsistencias(idInscripcion);
        //const historialData = await getHistorialAsistencias(inscripcion.id);
        setResumenAsistencias(resumenData);
        console.log("resumen asistencias", resumenData);
        //setHistorialAsistencias(historialData);

        // CUOTAS
        const ultimasCuotas = await obtenerUltimasCuotasDeInscripcion(servicioId, inscripcion.id);
        //const historialCuotas = await obtenerCuotasDeInscripcion(servicioId, inscripcion.id);
        setUltimasCuotas(ultimasCuotas);
        //setHistorialCuotas(historialCuotas);

        // RESUMEN PAGOS
        const resumenPagos = await getResumenPagosDeInscripcion(inscripcion.servicio.id, idInscripcion);
        setResumenPagos(resumenPagos);
        console.log("Resumen pagos", resumenPagos);

        console.log("data", ultimasCuotas);
      } catch (err) {
        setError("Error al obtener datos del usuario.");
      }
    };
    fetchInscripcion();
  }, [idInscripcion]);

  const isMissing = (value) =>
    !value || (typeof value === "string" && value.trim() === "");

  // Función para confirmar la finalización de la inscripción
  const handleConfirmarFinalizacion = () => {
    // Se redirige a /instructor/idInstructor/servicio/idServicio/alumnos
    const servicioId = inscripcion?.servicio?.id;
    setShowFinalizarModal(false);
    navigate(`/instructor/${idInstructor}/servicio/${servicioId}/alumnos`);
  };

  // Estilos para la columna izquierda y derecha
  const leftColumnStyle = isDesktop
    ? {
      position: "fixed",
      top: "10vh",
      left: 0,
      bottom: 0,
      width: "33.33%",
      padding: "30px",
      backgroundColor: "#f8f9fa",
      // No scroll global
    }
    : { padding: "20px" };

  const rightColumnStyle = isDesktop
    ? {
      marginLeft: "33.33%",
      padding: "20px",
    }
    : { padding: "20px" };

  return (
    <Container fluid style={{ marginTop: "12vh", fontFamily: "Roboto" }}>
      {error && <p className="text-danger">{error}</p>}
      {!inscripcion ? (
        <p>Cargando datos de la inscripcion...</p>
      ) : (
        <Row>
          {/* Columna Izquierda */}
          <Col xs={12} lg={4} style={leftColumnStyle}>
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}
            >
              <div style={{ flex: "1 1 70%" }}>
                <InscripcionData
                  inscripcionData={inscripcion}
                  sePuedeEditar={false}
                />
              </div>
            </div>
          </Col>

          {/* Columna Derecha */}
          <Col xs={12} lg={8} style={rightColumnStyle}>
            <AsistenciasInscripcion
              inscripcion={inscripcion}
              resumenAsistencias={resumenAsistencias}
            />

            <CuotasInscripcion
              inscripcion={inscripcion}
              cuotas={ultimasCuotas}
              resumenPagos={resumenPagos}
            />

            {/* Reseñas realizadas */}
            {resenias.length > 0 &&
              <div className="card shadow-lg p-4 mb-4">
                <h3 style={{ color: "#6a5acd" }}>Reseñas realizadas</h3>
                <ListGroup variant="flush">
                  <ReviewCarousel resenias={resenias} />
                </ListGroup>
              </div>
            }

            {/* Acciones */}
            <div className="card shadow-lg p-4 mb-4">
              <h3 style={{ color: "#6a5acd" }}>Acciones</h3>
              <ListGroup variant="flush">
                {inscripcion.estado != "Finalizada" &&
                  <>
                    <ListGroup.Item
                      action
                      onClick={() => setShowFinalizarModal(true)}
                    >
                      Finalizar Inscripción
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => navigate("/")}>
                      Cambiar de Grupo
                    </ListGroup.Item>
                  </>
                }
                <ListGroup.Item action onClick={() => navigate("/dar-de-baja")}>
                  Reportar alumno
                </ListGroup.Item>
              </ListGroup>
            </div>
          </Col>
        </Row>
      )}

      {/* Modal para finalizar inscripción */}
      {inscripcion && (
        <FinalizarInscripcionModal
          show={showFinalizarModal}
          onHide={() => setShowFinalizarModal(false)}
          inscripcionSeleccionada={inscripcion}
          onConfirmar={handleConfirmarFinalizacion}
        />
      )}
    </Container>
  );
};

export default ResumenInscripcion;