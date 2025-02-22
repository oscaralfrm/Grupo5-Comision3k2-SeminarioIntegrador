import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { FaStar, FaRegStar } from "react-icons/fa";
import { generarLinkMaps, getAllServiciosPublicosSinAlumnoOInstructor } from "../../../services/Servicio";
import { getInscripcionesDeAlumno, getServiciosFavoritosDeAlumno } from "../../../services/Alumno";
import { armarStringPrecioYFrecuenciaCobro } from "../../../services/frecuenciaPago";
import placeholderImage from "../../../assets/placeholderForServices.png";
import { getAllCategorias } from "../../../services/Categoria";
import FiltrosPanel from "./FiltrosDescubrir";
import FavoriteButton from "./AgregarAFavs";

// Hook de debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const DescubrirServicios = () => {
  const { idAlumno, idInstructor } = useParams();
  const navigate = useNavigate();

  // Estados de servicios, paginación y carga
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const [serviciosFavoritos, setServiciosFavoritos] = useState([]);

  // Estado para mantener los filtros
  const [filters, setFilters] = useState({
    searchTerm: "",
    categoriaFilter: "",
    ubicacionFilter: "",
    calificacionMinima: "0",
    modalidadClases: "",
    conClaseGratis: false,
    frecuenciaSemanalClases: "",
    precioMinimo: "",
    tipoFrecuenciaPago: "",
    diasSemanales: [],
    turnos: []
  });

  // Versiones debounced para campos de texto
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 400);
  const debouncedUbicacionFilter = useDebounce(filters.ubicacionFilter, 400);

  // Estado para controlar el panel de filtros (si está abierto)
  const [showFilters, setShowFilters] = useState(false);

  // Estado para las categorías obtenidas del backend
  const [categorias, setCategorias] = useState([]);

  // Estado para saber si el alumno tiene inscripciones
  const [hasInscripciones, setHasInscripciones] = useState(false);

  // Detectamos el ancho de ventana para aplicar lógica responsive
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallScreen = windowWidth < 768;

  // Función para renderizar estrellas
  const renderStars = (rating) => {
    const safeRating = Math.min(5, Math.max(0, rating || 0));
    return [1, 2, 3, 4, 5].map((star) =>
      star <= safeRating ? <FaStar key={star} color="#FF9900" size={10} /> : <FaRegStar key={star} color="gray" size={15} />
    );
  };

  // Función para alternar valores en arrays (días y turnos)
  const handleToggleArrayValue = (key, value) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    setFilters({ ...filters, [key]: newArray });
    setPage(0);
    console.log(`Nuevo array para ${key}:`, newArray);
  };

  // Función para mapear el tipo de frecuencia a un objeto
  const getTipoFrecuenciaPagoParam = (value) => {
    switch (value) {
      case "Mensual":
        return { cantCiclo: 1, unidadCiclo: "MONTHS" };
      case "Semanal":
        return { cantCiclo: 1, unidadCiclo: "WEEKS" };
      case "Diario":
        return { cantCiclo: 1, unidadCiclo: "DAYS" };
      case "Cada 2 semanas":
        return { cantCiclo: null, unidadCiclo: null };
      default:
        return { cantCiclo: null, unidadCiclo: null };
    }
  };

  // Función de paginación (botones numerados)
  const paginate = (newPage) => {
    setPage(newPage - 1); // 0-indexado
  };

  // Botón para limpiar filtros
  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      categoriaFilter: "",
      ubicacionFilter: "",
      calificacionMinima: "0",
      modalidadClases: "",
      conClaseGratis: false,
      frecuenciaSemanalClases: "",
      precioMinimo: "",
      tipoFrecuenciaPago: "",
      diasSemanales: [],
      turnos: []
    });
    setPage(0);
  };

  // useEffect para cargar servicios según filtros
  useEffect(() => {
    const fetchServicios = async () => {
      setLoading(true);
      try {
        const precio =
          filters.precioMinimo && filters.tipoFrecuenciaPago ? filters.precioMinimo : "";
        const tipoObj =
          filters.precioMinimo && filters.tipoFrecuenciaPago
            ? getTipoFrecuenciaPagoParam(filters.tipoFrecuenciaPago)
            : { cantCiclo: "", unidadCiclo: "" };

        const response = await getAllServiciosPublicosSinAlumnoOInstructor({
          nombre: debouncedSearchTerm,
          categoriaNombre: filters.categoriaFilter,
          modalidadClasesNombre: filters.modalidadClases,
          calificacionMinima: filters.calificacionMinima,
          ubicacion: debouncedUbicacionFilter,
          conClaseGratis: filters.conClaseGratis,
          frecuenciaSemanalClases: filters.frecuenciaSemanalClases,
          precioMinimo: precio,
          cantCiclo: tipoObj.cantCiclo,
          unidadCiclo: tipoObj.unidadCiclo,
          diasSemanales: filters.diasSemanales,
          turnos: filters.turnos,
          idAlumno,
          idInstructor,
          page,
          size
        });
        if (response.content) {
          setServicios(response.content);
          setTotalPages(response.totalPages);
        } else {
          setServicios(response);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkInscripciones = async () => {
      try {
        if (idAlumno) {
          const inscripciones = await getInscripcionesDeAlumno(idAlumno);
          setHasInscripciones(inscripciones.length > 0);
        }
       
      } catch (error) {
        console.error("Error al verificar inscripciones:", error);
      }
    };

    fetchServicios();
    checkInscripciones();
  }, [
    debouncedSearchTerm,
    filters.categoriaFilter,
    filters.modalidadClases,
    debouncedUbicacionFilter,
    filters.calificacionMinima,
    filters.conClaseGratis,
    filters.frecuenciaSemanalClases,
    filters.precioMinimo,
    filters.tipoFrecuenciaPago,
    filters.diasSemanales,
    filters.turnos,
    page,
    idAlumno,
    idInstructor,
    size
  ]);

  // useEffect para cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await getAllCategorias();
        setCategorias(response);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

    // useEffect para cargar categorías
    useEffect(() => {
      const fetchServiciosFavoritos = async () => {
        try {
          if (idAlumno) {
            const response = await getServiciosFavoritosDeAlumno(idAlumno);
            setServiciosFavoritos(response);
          }
         
        } catch (error) {
          console.error("Error al obtener categorías:", error);
        }
      };
      fetchServiciosFavoritos();
    }, [idAlumno]);

  // Para el panel de filtros:
  // En pantallas grandes, cuando abierto: ancho = 40vw; colapsado: 80px.
  // En pantallas pequeñas, cuando cerrado: ancho = 0; cuando abierto: ancho = 80vw (overlay)
  const panelWidth =
    windowWidth >= 768
      ? showFilters
        ? "40vw"
        : "80px"
      : showFilters
        ? "80vw"
        : "0";

  // Calculamos panelTop según el ancho de ventana:
  // Para >= 992px: "76px"
  // Para entre 220px y 991px: "67px"
  // Para <= 219px: "107px"
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
    height: `calc(100vh - 76px)`, // Suponiendo que la navbar tiene 76px
    position: "fixed",
    top: panelTop,
    left: 0,
    zIndex: 9999,
    transition: "width 0.3s",
  };

  // En pantallas grandes, el contenido se desplaza; en pequeñas, ocupa el ancho completo.
  const contentMarginLeft =
    windowWidth >= 768 ? (showFilters ? "40vw" : "80px") : "0";

  const contentStyle = {
    marginLeft: contentMarginLeft,
    marginTop: "10px",
    transition: "margin-left 0.3s",
    padding: "20px"
  };

  // En pantallas pequeñas, mostramos un botón flotante para abrir/cerrar filtros si están colapsados.
  const mobileFilterButtonStyle = {
    position: "fixed",
    top: "80px",
    left: "10px",
    zIndex: 10000
  };

  return (
    <Container fluid style={{ padding: 0 }}>
      {/* Panel de Filtros */}
      <div style={panelStyle}>
        <FiltrosPanel
          filters={filters}
          setFilters={setFilters}
          categorias={categorias}
          onToggleValue={handleToggleArrayValue}
          onClearFilters={clearFilters}
          showFilters={showFilters}
          toggleShowFilters={() => setShowFilters(!showFilters)}
        />
      </div>

      {/* Botón flotante para dispositivos pequeños */}
      {windowWidth < 768 && !showFilters && (
        <Button
          variant="primary"
          style={mobileFilterButtonStyle}
          onClick={() => setShowFilters(true)}
        >
          Filtros
        </Button>
      )}

      {/* Contenido principal */}
      <div style={contentStyle}>
        <h2 style={{ textAlign: "center", color: "#1E1B4B", marginTop: "100px" }}>
          Descubrir Servicios
        </h2>
        {loading ? (
          <div className="d-flex flex-column align-items-center my-5">
            <Spinner
              animation="border"
              role="status"
              style={{ width: "4rem", height: "4rem", color: "#4F46E5" }}
            />
            <p className="mt-3" style={{ color: "#4F46E5", fontWeight: "bold" }}>
              Cargando servicios, por favor espere...
            </p>
          </div>
        ) : (
          <>
            <Row className="justify-content-center">
              {servicios?.length === 0 ? (
                <p>No se encontraron servicios.</p>
              ) : (
                servicios.map((servicio) => (
                  <Col xs={12} md={10} key={servicio.id} className="mb-4">
                    <Card
                      style={{
                        border: "none",
                        backgroundColor: "white",
                        borderRadius: "20px",
                        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
                        minHeight: "200px",
                        position: "relative", // Asegura que el botón se posicione respecto a la card
                      }}
                    >


                      <Card.Header
                        style={{
                          textAlign: "center",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          padding: "15px",
                          color: "white",
                          borderTopLeftRadius: "20px",
                          borderTopRightRadius: "20px",
                          backgroundColor: "#1E1B4B"
                        }}
                      >
                        {servicio.nombre}
                        {/* Botón de Favoritos en la esquina superior derecha */}
                        {idAlumno &&
                          <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                          <FavoriteButton
                           servicioId={servicio.id}
                           serviciosFavoritos={serviciosFavoritos}
                          />
                        </div>
                        }
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-0 align-items-center">
                          <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                            <img
                              src={servicio.logoURL || placeholderImage}
                              alt={servicio.nombre}
                              style={{
                                width: "100%",
                                maxWidth: "120px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "10px"
                              }}
                            />
                          </Col>
                          <Col xs={12} md={8}>
                            <div style={{ padding: "20px 15px" }}>
                              <p>
                                <strong>Categoría:</strong> {servicio.categoria?.nombre}
                              </p>
                              <p>
                                <strong>Calificación:</strong> {renderStars(servicio.resumen?.calificacion)} ({servicio.resumen?.cantResenias})
                              </p>
                              <p>
                                <strong>Ubicación: </strong>
                                <a
                                  href={generarLinkMaps(servicio.ubicacion)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Ver en Google Maps"
                                  className="text-primary fw-semibold"
                                >
                                  {servicio.ubicacion} <i className="bi bi-geo-alt-fill"></i>
                                </a>
                              </p>
                              <p>
                                <strong>Instructor:</strong> {servicio.instructorNombre}
                              </p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-0" style={{ marginLeft: "15px" }}>
                                <strong>Desde:</strong>{" "}
                                <strong style={{ fontSize: "1.5rem" }}>
                                  {armarStringPrecioYFrecuenciaCobro(
                                    servicio.montoMinimo,
                                    servicio.tipoFrecuenciaPago?.cantCiclo,
                                    servicio.tipoFrecuenciaPago?.unidadCiclo
                                  )}
                                </strong>
                              </p>
                              <Button
                                size="sm"
                                style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}
                                onClick={() =>
                                  idAlumno ?
                                    navigate(`/alumno/${idAlumno}/servicio/${servicio.id}/info-servicio`)
                                    : navigate(`/instructor/${idInstructor}/servicio/${servicio.id}/info-servicio`)
                                }
                              >
                                Ver más
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>

            {servicios?.length !== 0 && totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => paginate(page)}>
                        &lt;
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li
                        key={index + 1}
                        className={`page-item ${page === index ? "active" : ""}`}
                      >
                        <button className="page-link" onClick={() => paginate(index + 1)}>
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${page === totalPages - 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => paginate(page + 2)}>
                        &gt;
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </Container>

  );
};

export default DescubrirServicios;
