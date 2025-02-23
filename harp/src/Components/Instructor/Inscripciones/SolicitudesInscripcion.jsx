// PantallaSolicitudesInscripcion.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getInscripcionesDeServicio } from "../../../services/Inscripcion";
import { 
  getServiciosDeInstructor, 
  traerUltimasInscripcionesNoPendientesDeServiciosDeInstructor 
} from "../../../services/Instructor";
import DetalleInscripcionGrid from "./DetalleSolicitudInscripcion";
import { formatDistance, isSameDay, parse } from "date-fns";
import { es } from "date-fns/locale";

const calcularDiferenciaDeFechas = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return "Fecha no disponible";
    return formatDistance(new Date(fechaInicio), new Date(fechaFin), { locale: es });
};

const calcularFechasIgualAHoy = (fecha) => {
    const fechaLocal = parse(fecha, "yyyy-MM-dd", new Date());
    return isSameDay(fechaLocal, new Date());
};

const PantallaSolicitudesInscripcion = () => {
  const { idInstructor } = useParams();
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
  const [ultimasInscripciones, setUltimasInscripciones] = useState([]);
  const [error, setError] = useState(null);
  
  // Estado para definir el orden: "desc" = más recientes primero, "asc" = más antiguas primero.
  const [sortOrder, setSortOrder] = useState("desc");

  async function fetchSolicitudes() {
    try {
      const dataServicios = await getServiciosDeInstructor(idInstructor);
      const inscripcionesPromises = dataServicios.map(servicio =>
        getInscripcionesDeServicio(servicio.id, false, true, false)
      );
      const inscripcionesPorServicio = await Promise.all(inscripcionesPromises);
      const todasLasInscripciones = inscripcionesPorServicio.flat();
      setSolicitudes(todasLasInscripciones);
      
      const ultimas = await traerUltimasInscripcionesNoPendientesDeServiciosDeInstructor(idInstructor);
      setUltimasInscripciones(ultimas);
    } catch (err) {
      setError("Error al cargar las solicitudes.");
    }
  }

  useEffect(() => {
    fetchSolicitudes();
  }, [idInstructor]);

  const isMissing = (value) =>
    !value || (typeof value === "string" && value.trim() === "");

  // Función para alternar el orden de la lista
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === "desc" ? "asc" : "desc"));
  };

  // Se crea una copia ordenada de las solicitudes basada en la fecha de solicitud
  const sortedSolicitudes = [...solicitudes].sort((a, b) => {
    const dateA = new Date(a.fechaSolicitud);
    const dateB = new Date(b.fechaSolicitud);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const leftColumnStyle = {
    position: "fixed",
    top: "0",
    bottom: "0",
    left: "0",
    width: "30%",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    overflowY: "auto",
    marginTop: "100px"
  };

  const rightColumnStyle = {
    marginLeft: "30%",
    padding: "20px",
  };

  return (
    <Container fluid style={{ marginTop: "10vh", fontFamily: "Roboto" }}>
      <Row>
        {/* Columna izquierda: listado de solicitudes y últimas inscripciones */}
        <Col style={leftColumnStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px"
            }}
          >
            <h4 style={{ margin: 0 }}>Solicitudes de Inscripción</h4>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span 
                onClick={toggleSortOrder} 
                style={{ cursor: "pointer", fontSize: "20px", userSelect: "none" }}
                title={
                  sortOrder === "desc"
                    ? "Ordenar de más antiguas a más recientes"
                    : "Ordenar de más recientes a más antiguas"
                }
              >
                ⇅
              </span>
              <span 
                style={{ fontSize: "12px", color: "gray", marginLeft: "5px" }}
              >
                {sortOrder === "desc" ? "Más recientes" : "Más antiguas"}
              </span>
            </div>
          </div>
          {error && <p className="text-danger">{error}</p>}
          {sortedSolicitudes.length == 0 && "No hay nuevas solicitudes."}
          <ListGroup>
            {sortedSolicitudes.map((inscripcion) => (
              <ListGroup.Item
                key={inscripcion.id}
                action
                onClick={() => setInscripcionSeleccionada(inscripcion)}
                style={{
                  marginBottom: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd"
                }}
              >
                <div 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    width: "100%" 
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img 
                      src={inscripcion.alumno.usuario?.fotoPerfilURL || "https://via.placeholder.com/40"} 
                      alt="Foto de perfil" 
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "10px",
                        alignSelf: "flex-start"
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {inscripcion.alumno.nombreCompleto}
                      </div>
                      <div style={{ fontSize: "12px", color: "gray", marginTop: "2px" }}>
                        {inscripcion.servicio.nombre} - {inscripcion.grupo.nombre}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "gray" }}>
                    {calcularFechasIgualAHoy(inscripcion.fechaSolicitud)
                      ? "Hoy"
                      : `Hace ${calcularDiferenciaDeFechas(new Date(), inscripcion.fechaSolicitud)}`}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Sección de Últimas Inscripciones */}
          <hr style={{ marginTop: "30px", marginBottom: "15px" }} />
          <h5 style={{ marginBottom: "10px" }}>Últimas Inscripciones</h5>
          <ListGroup>
            {ultimasInscripciones.map((inscripcion) => (
              <ListGroup.Item
                key={inscripcion.id}
                action
                onClick={() => setInscripcionSeleccionada(inscripcion)}
                style={{
                  marginBottom: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd"
                }}
              >
                <div 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    width: "100%" 
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img 
                      src={inscripcion.alumno.usuario?.fotoPerfilURL || "https://via.placeholder.com/40"} 
                      alt="Foto de perfil" 
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "10px",
                        alignSelf: "flex-start"
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {inscripcion.alumno.nombreCompleto}
                      </div>
                      <div style={{ fontSize: "12px", color: "gray", marginTop: "2px" }}>
                        {inscripcion.servicio.nombre} - {inscripcion.grupo.nombre}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "gray" }}>
                    {inscripcion.estado}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Columna derecha: detalle de la inscripción seleccionada */}
        <Col style={rightColumnStyle}>
          {inscripcionSeleccionada ? (
            <DetalleInscripcionGrid 
              inscripcionSeleccionada={inscripcionSeleccionada} 
              isMissing={isMissing} 
              fetchSolicitudes={fetchSolicitudes}
            />
          ) : (
            <div>
              <h5 style={{ marginTop: "50px" }}>Seleccione una solicitud para ver el detalle</h5>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PantallaSolicitudesInscripcion;
