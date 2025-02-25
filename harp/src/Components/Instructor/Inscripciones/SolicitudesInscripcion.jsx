import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Pagination } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getInscripcionesDeServicio } from "../../../services/Inscripcion";
import {
  getServiciosDeInstructor,
  traerUltimasInscripcionesNoPendientesDeServiciosDeInstructor
} from "../../../services/Instructor";
import DetalleInscripcionGrid from "./DetalleSolicitudInscripcion";
import { formatDistance, isSameDay, parse } from "date-fns";
import { es } from "date-fns/locale";
import profileImg from "../../../assets/profile.png"

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
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageUltimas, setCurrentPageUltimas] = useState(1);
  const itemsPerPage = 5; // Cambiado a 5 para paginación

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSolicitudes = sortedSolicitudes.slice(indexOfFirstItem, indexOfLastItem);

  const indexOfLastItemUltimas = currentPageUltimas * itemsPerPage;
  const indexOfFirstItemUltimas = indexOfLastItemUltimas - itemsPerPage;
  const currentUltimasInscripciones = ultimasInscripciones.slice(indexOfFirstItemUltimas, indexOfLastItemUltimas);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateUltimas = (pageNumber) => setCurrentPageUltimas(pageNumber);

  return (
    <Container fluid style={{ marginTop: "10vh", fontFamily: "Roboto" }}>
      <Row style={{ marginTop: "2rem" }}>
        {/* Columna izquierda: listado de solicitudes y últimas inscripciones */}
        <Col xs={12} md={4} className="order-2 order-md-1 leftColumnStyle">
          <div
            className="d-flex justify-content-between align-items-center mb-3"
          >
            <h4 className="mb-0">Solicitudes de Inscripción</h4>
            <div className="d-flex align-items-center">
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
          {currentSolicitudes.length === 0 && "No hay nuevas solicitudes."}
          <ListGroup>
            {currentSolicitudes.map((inscripcion) => (
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
                      src={inscripcion.alumno.usuario?.fotoPerfilURL || profileImg} 
                      alt="Foto de perfil" 
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "10px",
                        alignSelf: "flex-start"
                      }}
                    />
                    <div style={{ fontSize: "14px", textAlign: "left" }}>
                      <div style={{ fontWeight: "bold" }}>
                        {inscripcion.alumno.nombreCompleto}
                      </div>
                      <div style={{ color: "gray", marginTop: "2px" }}>
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

          {/* Paginación para pantallas medianas o grandes */}
          <Pagination className="d-flex justify-content-center mt-3 d-none d-md-flex">
            {Array.from({ length: Math.ceil(sortedSolicitudes.length / itemsPerPage) }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>

          {/* Paginación para pantallas pequeñas */}
          <Pagination className="d-flex justify-content-center mt-3 d-md-none">
            {Array.from({ length: Math.ceil(sortedSolicitudes.length / itemsPerPage) }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>

          {/* Sección de Últimas Inscripciones */}
          <hr style={{ marginTop: "30px", marginBottom: "15px" }} />
          <h5 style={{ marginBottom: "10px" }}>Últimas Inscripciones</h5>
          <ListGroup>
            {currentUltimasInscripciones.map((inscripcion) => (
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
                      src={inscripcion.alumno.usuario?.fotoPerfilURL || profileImg} 
                      alt="Foto de perfil" 
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "10px",
                        alignSelf: "flex-start"
                      }}
                    />
                    <div style={{ fontSize: "14px", textAlign: "left" }}>
                      <div style={{ fontWeight: "bold" }}>
                        {inscripcion.alumno.nombreCompleto}
                      </div>
                      <div style={{ color: "gray", marginTop: "2px" }}>
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

          {/* Paginación para Últimas Inscripciones en pantallas medianas o grandes */}
          <Pagination className="d-flex justify-content-center mt-3 d-none d-md-flex">
            {Array.from({ length: Math.ceil(ultimasInscripciones.length / itemsPerPage) }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPageUltimas}
                onClick={() => paginateUltimas(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>

          {/* Paginación para Últimas Inscripciones en pantallas pequeñas */}
          <Pagination className="d-flex justify-content-center mt-3 d-md-none">
            {Array.from({ length: Math.ceil(ultimasInscripciones.length / itemsPerPage) }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPageUltimas}
                onClick={() => paginateUltimas(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>

        {/* Columna derecha: detalle de la inscripción seleccionada */}
        <Col xs={12} md={8} className="order-1 order-md-2">
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
