import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getInscripcionesVigentesDeAlumno } from "../../../services/Alumno";
import { obtenerUltimasCuotasDeInscripcion } from "../../../services/Cuota";
import { obtenerInstructorDeServicio } from "../../../services/Instructor";
import { getServicioById } from "../../../services/Servicio";
import AlumnoPagoCuotaCard from "./AlumnoPagoCuotaCard.jsx";
import FiltrosPagos from "./FiltrosPagos";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";

const MisCuotas = () => {
  const { idAlumno } = useParams();
  const [cuotas, setCuotas] = useState([]);
  const [filteredCuotas, setFilteredCuotas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoCuotaFilter, setEstadoCuotaFilter] = useState("");
  const [fechaLimitePagoFilter, setFechaLimitePagoFilter] = useState("");
  const [montoABonarFilter, setMontoABonarFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false); // Colapsado por defecto
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);

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

      // Optimización: Procesar cada inscripción secuencialmente.
      for (const inscripcion of inscripciones) {
        const cuotasInscripcion = await obtenerUltimasCuotasDeInscripcion(
          inscripcion.servicio.id,
          inscripcion.id
        );

        const servicio = await getServicioById(inscripcion.servicio.id);
        const instructor = await obtenerInstructorDeServicio(servicio.id);

        //Mapear las cuotas e incluir el nombre del instructor
        for (const cuota of cuotasInscripcion) {
          todasLasCuotas.push({
            ...cuota,
            inscripcion,
            instructor: instructor.usuario.nombre + " " + instructor.usuario.apellido, // Guardamos el nombre del instructor
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
      filtered = filtered.filter(cuota => cuota.inscripcion?.servicio?.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (estadoCuotaFilter) {
      filtered = filtered.filter(cuota => cuota.cambiosEstado?.some(estado => estado.fechaFin === null && estado.estadoCuota === estadoCuotaFilter));
    }

    if (fechaLimitePagoFilter) {
      filtered = filtered.filter(cuota => cuota.fechaLimitePago?.slice(0, 10) === fechaLimitePagoFilter);
    }

    if (montoABonarFilter) {
      filtered = filtered.filter(cuota => ((cuota.montoServicio?.monto || 0) + (cuota.recargo || 0)).toString() === montoABonarFilter);
    }

    setFilteredCuotas(filtered);
  }, [cuotas, searchTerm, estadoCuotaFilter, fechaLimitePagoFilter, montoABonarFilter]);

  const isSmallScreen = windowWidth < 768;
  const isMediumScreen = windowWidth >= 768 && windowWidth < 992;
  const isLargeScreen = windowWidth >= 992 && windowWidth < 1200;
  const isXLargeScreen = windowWidth >= 1200;

  const panelWidth =
    windowWidth >= 768
      ? showFilters
        ? "40vw"
        : "80px"
      : showFilters
        ? "80vw"
        : "0";

  let panelTop;
  if (windowWidth >= 992) {
    panelTop = "76px";
  } else if (windowWidth > 235) {
    panelTop = "66px";
  } else {
    panelTop = "106px";
  }

  const panelStyle = {
    width: panelWidth,
    height: `calc(100vh - ${panelTop}px)`, // Corregido: Usamos template literals
    position: "fixed",
    top: panelTop,
    left: 0,
    zIndex: 9999,
    transition: "width 0.3s",
    backgroundColor: "#f8f9fa"
  };

  const contentMarginLeft =
    windowWidth >= 768 ? (showFilters ? "40vw" : "80px") : "0";

  const contentStyle = {
    marginLeft: contentMarginLeft,
    marginTop: "60px",
    transition: "margin-left 0.3s",
    padding: "20px"
  };

  const mobileFilterButtonStyle = {
    position: "fixed",
    top: "80px",
    left: "10px",
    zIndex: 10000
  };

  return (
    <Container fluid style={{ padding: 0 }}>
      <div style={panelStyle}>
        <FiltrosPagos
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          estadoCuotaFilter={estadoCuotaFilter}
          setEstadoCuotaFilter={setEstadoCuotaFilter}
          fechaLimitePagoFilter={fechaLimitePagoFilter}
          setFechaLimitePagoFilter={setFechaLimitePagoFilter}
          montoABonarFilter={montoABonarFilter}
          setMontoABonarFilter={setMontoABonarFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          isSmallScreen={isSmallScreen}
          isMediumScreen={isMediumScreen}
          isLargeScreen={isLargeScreen}
          isXLargeScreen={isXLargeScreen}
        />
      </div>

      {windowWidth < 768 && !showFilters && (
        <Button
          variant="primary"
          style={mobileFilterButtonStyle}
          onClick={() => setShowFilters(true)}
        >
          Filtros
        </Button>
      )}

      <div style={contentStyle}>
        <h2 style={{ textAlign: "center", color: "#1E1B4B", marginTop: "20px" }}>
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
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                {filteredCuotas.map(cuota => (
                  <AlumnoPagoCuotaCard key={cuota.id} cuota={cuota} fetchCuotas={fetchCuotas} isPanelCollapsed={!showFilters} />
                ))}
              </div>
            </Col>
          </Row>
        )}
      </div>
    </Container>
  );
};

export default MisCuotas;