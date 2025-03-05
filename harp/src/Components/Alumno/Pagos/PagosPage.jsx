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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            instructor: instructor.usuario.nombre + " " + instructor.usuario.apellido,
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
    fetchCuotas();
  }, [idAlumno]);

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

  const paginate = (direction) => {
    setCurrentPage(prevPage => Math.max(1, Math.min(prevPage + direction, Math.ceil(filteredCuotas.length / cardsPerPage))));
  };

  const isSmallScreen = windowWidth < 768;

  return (
    <Container fluid style={{ padding: 0, display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column" }}>
        <h2 style={{ textAlign: "center", color: "#1E1B4B", marginTop: "100px" }}>
          Mis Pagos
        </h2>
        {loading ? (
          <div className="d-flex flex-column align-items-center my-5">
            <Spinner
              animation="border"
              role="status"
              style={{ width: "4rem", height: "4rem", color: "#4F46E5" }}
            />
            <p className="mt-3" style={{ color: "#4F46E5", fontWeight: "bold" }}>
              Cargando cuotas, por favor espere...
            </p>
          </div>
        ) : (
          <>
            <Row className="justify-content-center" style={{ flex: 1, position: "relative" }}>
              <Col xs={12} md={10} lg={8} style={{ display: "flex", flexWrap: showFilters ? "nowrap" : "wrap", gap: "20px", overflowX: "auto", height: "100%" }}>
                {currentCards.map(cuota => (
                  <AlumnoPagoCuotaCard
                    key={cuota.id}
                    cuota={cuota}
                    fetchCuotas={fetchCuotas}
                    isPanelCollapsed={!showFilters}
                    style={{ width: showFilters ? "30%" : "100%", height: "auto" }} // Ensure the card content is visible
                  />
                ))}
              </Col>
              {showFilters && (
                <>
                  <Col xs="auto" className="d-flex align-items-center" style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)" }}>
                    <Button 
                      onClick={() => paginate(-1)} 
                      disabled={currentPage === 1} 
                      style={{ 
                        height: showFilters ? "30px" : "40px", 
                        borderRadius: 0, 
                        fontSize: showFilters ? "10px" : "12px" 
                      }}
                    >
                      &lt;&lt;
                    </Button>
                  </Col>
                  <Col xs="auto" className="d-flex align-items-center" style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)" }}>
                    <Button 
                      onClick={() => paginate(1)} 
                      disabled={indexOfLastCard >= filteredCuotas.length} 
                      style={{ 
                        height: showFilters ? "30px" : "40px", 
                        borderRadius: 0, 
                        fontSize: showFilters ? "10px" : "12px" 
                      }}
                    >
                      &gt;&gt;
                    </Button>
                  </Col>
                </>
              )}
            </Row>
          </>
        )}
      </div>

      <div style={{ borderTop: "1px solid #ddd", padding: "10px", backgroundColor: "#f8f9fa", height: showFilters ? "50vh" : "auto", overflowY: "auto" }}>
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
          isSmallScreen={isSmallScreen}
        />
      </div>
    </Container>
  );
};

export default MisCuotas;