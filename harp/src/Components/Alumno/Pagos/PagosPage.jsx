import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getInscripcionesVigentesDeAlumno } from "../../../services/Alumno";
import { obtenerUltimasCuotasDeInscripcion } from "../../../services/Cuota";
import { obtenerInstructorDeServicio } from "../../../services/Instructor";
import { getServicioById } from "../../../services/Servicio";
import AlumnoPagoCuotaCard from "./AlumnoPagoCuotaCard.jsx";
import FiltrosPagos from "./FiltrosPagos";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";

const MisCuotas = () => {
  const { idAlumno } = useParams();
  const [cuotas, setCuotas] = useState([]);
  const [filteredCuotas, setFilteredCuotas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoCuotaFilter, setEstadoCuotaFilter] = useState("");
  const [fechaLimitePagoFilter, setFechaLimitePagoFilter] = useState("");
  const [montoABonarFilter, setMontoABonarFilter] = useState("");
  const [fechaInicioFilter, setFechaInicioFilter] = useState("");
  const [fechaFinFilter, setFechaFinFilter] = useState("");
  const [instructorFilter, setInstructorFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;

  // Estado para controlar si el modal de pago está abierto
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Detectar el ancho de la ventana para aplicar lógica responsive
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallScreen = windowWidth < 768;

  useEffect(() => {
    fetchCuotas();
  }, [idAlumno]);

  const fetchCuotas = async () => {
    setLoading(true);
    try {
      const inscripciones = await getInscripcionesVigentesDeAlumno(idAlumno);
      let todasLasCuotas = [];

      for (const inscripcion of inscripciones) {
        const cuotasInscripcion = await obtenerUltimasCuotasDeInscripcion(
          inscripcion.servicio.id,
          inscripcion.id
        );

        const servicio = await getServicioById(inscripcion.servicio.id);
        const instructor = await obtenerInstructorDeServicio(servicio.id);

        for (const cuota of cuotasInscripcion) {
          todasLasCuotas.push({
            ...cuota,
            inscripcion,
            instructor: `${instructor.usuario.nombre} ${instructor.usuario.apellido || ""}`,
          });
        }
      }

      setCuotas(todasLasCuotas);
      setFilteredCuotas(todasLasCuotas);
    } catch (error) {
      console.error("Error al obtener las cuotas del alumno:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...cuotas];

    if (searchTerm) {
      filtered = filtered.filter(cuota =>
        cuota.inscripcion?.servicio?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuota.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (estadoCuotaFilter) {
      filtered = filtered.filter(cuota => cuota.cambiosEstado?.some(estado => estado.fechaFin === null && estado.estadoCuota === estadoCuotaFilter));
    }

    if (fechaLimitePagoFilter) {
      filtered = filtered.filter(cuota => cuota.fechaLimitePago?.includes(fechaLimitePagoFilter));
    }

    if (montoABonarFilter) {
      filtered = filtered.filter(cuota => ((cuota.montoServicio?.monto || 0) + (cuota.recargo || 0)).toString() === montoABonarFilter);
    }

    if (fechaInicioFilter) {
      filtered = filtered.filter(cuota => cuota.fechaInicioCiclo?.includes(fechaInicioFilter));
    }

    if (fechaFinFilter) {
      filtered = filtered.filter(cuota => cuota.fechaFinCiclo?.includes(fechaFinFilter));
    }

    if (instructorFilter) {
      filtered = filtered.filter(cuota =>
        cuota.instructor.toLowerCase().includes(instructorFilter.toLowerCase()) ||
        cuota.inscripcion?.servicio?.nombre.toLowerCase().includes(instructorFilter.toLowerCase())
      );
    }

    setFilteredCuotas(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [cuotas, searchTerm, estadoCuotaFilter, fechaLimitePagoFilter, montoABonarFilter, fechaInicioFilter, fechaFinFilter, instructorFilter]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCuotas.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCuotas.length / cardsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container fluid style={{ padding: 0, display: "flex", height: "100vh" }}>
      {/* Panel de Filtros */}
      <div
        style={{
          width: showFilters ? "450px" : "80px",
          height: "calc(100vh - 76px)",
          position: "fixed",
          top: "76px",
          left: 0,
          zIndex: isSmallScreen ? 999 : 9999, // Ajuste dinámico del z-index
          backgroundColor: "#f8f9fa",
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          transition: "width 0.3s",
          opacity: isPaymentModalOpen ? 0.5 : 1, // Sombreado cuando el modal está abierto
          pointerEvents: isPaymentModalOpen ? "none" : "auto", // Deshabilitar interacción
        }}
      >
        {/* Botón para Expandir Filtros (Visible cuando colapsado) */}
        {!showFilters && (
          <Button
            variant="light"
            style={{
              width: "100%",
              height: "50px",
              borderRadius: "0",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f8f9fa", // Mismo color gris que el panel
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
            }}
            onClick={() => setShowFilters(true)}
          >
            {/* Ícono de Bootstrap */}
            <i className="bi bi-sliders" style={{ color: "#000000", fontSize: "24px" }}></i>
          </Button>
        )}

        {/* Contenido del Panel de Filtros */}
        {showFilters && (
          <FiltrosPagos
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            estadoCuotaFilter={estadoCuotaFilter}
            setEstadoCuotaFilter={setEstadoCuotaFilter}
            fechaLimitePagoFilter={fechaLimitePagoFilter}
            setFechaLimitePagoFilter={setFechaLimitePagoFilter}
            montoABonarFilter={montoABonarFilter}
            setMontoABonarFilter={setMontoABonarFilter}
            fechaInicioFilter={fechaInicioFilter}
            setFechaInicioFilter={setFechaInicioFilter}
            fechaFinFilter={fechaFinFilter}
            setFechaFinFilter={setFechaFinFilter}
            instructorFilter={instructorFilter}
            setInstructorFilter={setInstructorFilter}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        )}
      </div>

      {/* Contenido Principal */}
      <div
        style={{
          marginLeft: showFilters ? "450px" : "80px",
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          transition: "margin-left 0.3s",
        }}
      >
        {/* Título de los Cobros */}
        <h2 style={{ textAlign: "center", color: "#1E1B4B", marginTop: "20vh" }}>Mis Pagos</h2>

        {/* Cards */}
        {loading ? (
          <div className="d-flex flex-column align-items-center my-5">
            <Spinner animation="border" role="status" style={{ width: "4rem", height: "4rem", color: "#4F46E5" }} />
            <p className="mt-3" style={{ color: "#4F46E5", fontWeight: "bold" }}>Cargando cuotas, por favor espere...</p>
          </div>
        ) : (
          <Row className="justify-content-center mt-3">
            {currentCards.map((cuota) => (
              <Col key={cuota.id} xs={12} style={{ marginBottom: "20px" }}>
                <AlumnoPagoCuotaCard
                  cuota={cuota}
                  fetchCuotas={fetchCuotas}
                  isPanelCollapsed={!showFilters}
                  setIsPaymentModalOpen={setIsPaymentModalOpen} // Pasar función para controlar el modal
                  style={{ width: "100%", height: "auto" }}
                />
              </Col>
            ))}
          </Row>
        )}

        {/* Pagination */}
        <Row className="justify-content-center mt-3">
          <Col xs={12} md={8} lg={6}>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  variant={currentPage === i + 1 ? "primary" : "outline-primary"}
                  size="sm"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default MisCuotas;