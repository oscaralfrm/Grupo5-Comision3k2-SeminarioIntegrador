import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import {
  getAllServiciosPublicosSinAlumno,
  generarLinkMaps,
} from "../../services/Servicio";
import { getInscripcionesDeAlumno } from "../../services/Alumno"; // Importar el servicio
import { FaStar, FaRegStar } from "react-icons/fa";
import { armarStringPrecioYFrecuenciaCobro } from "../../services/frecuenciaPago";
import placeholderImage from "../../assets/placeholderForServices.png";

const DescubrirServicios = () => {
  const { idAlumno } = useParams();
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasInscriptions, setHasInscriptions] = useState(false); // Estado para controlar si tiene inscripciones

  const renderStars = (rating) => {
    const safeRating = Math.min(5, Math.max(0, rating || 0));
    return [1, 2, 3, 4, 5].map((star) =>
      star <= safeRating ? (
        <FaStar key={star} color="#FF9900" size={10} />
      ) : (
        <FaRegStar key={star} color="gray" size={15} />
      )
    );
  };

  useEffect(() => {
    const fetchServicios = async () => {
      setLoading(true);
      try {
        const response = await getAllServiciosPublicosSinAlumno(
          page,
          size,
          idAlumno
        );
        setServicios(response);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkInscripciones = async () => {
      try {
        const inscripciones = await getInscripcionesDeAlumno(idAlumno);
        // Verificamos si el array de inscripciones tiene al menos un elemento
        setHasInscriptions(inscripciones.length > 0);
      } catch (error) {
        console.error("Error al verificar inscripciones:", error);
      }
    };

    fetchServicios();
    checkInscripciones(); // Llamamos a la función para verificar inscripciones
  }, [page, idAlumno, size]);

  const filteredServicios = servicios.filter((servicio) =>
    servicio.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container style={{ marginTop: "20vh" }}>
      {/* Botón "Mis Inscripciones" 
      {hasInscriptions && (
        <Button
          style={{
            position: "fixed",
            top: "100px",
            right: "20px",
            backgroundColor: "#4F46E5",
            borderColor: "#4F46E5",
            fontSize: "1rem",
            padding: "10px 20px",
            borderRadius: "10px",
            zIndex: 1000,
          }}
          onClick={() => navigate(`/alumno/${idAlumno}/inscripciones`)}
        >
          Mis Inscripciones
        </Button>
      )}
        */}

      <Card style={{ padding: "20px", borderRadius: "10px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "5px",
            color: "#1E1B4B",
            fontFamily: "Roboto",
          }}
        >
          Descubrir Servicios
        </h2>

        {/* Barra de búsqueda */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {loading ? (
          <div className="d-flex flex-column align-items-center my-5">
            <Spinner
              animation="border"
              role="status"
              style={{ width: "4rem", height: "4rem", color: "#4F46E5" }}
            />
            <p
              className="mt-3"
              style={{ color: "#4F46E5", fontWeight: "bold" }}
            >
              Cargando servicios, por favor espere...
            </p>
          </div>
        ) : (
          <Row className="justify-content-center">
            {filteredServicios.length === 0 ? (
              <p>No se encontraron servicios.</p>
            ) : (
              filteredServicios.map((servicio) => (
                <Col
                  xs={12}
                  md={10}
                  key={servicio.id}
                  style={{ marginBottom: "20px" }}
                >
                  <Card
                    style={{
                      border: "none",
                      backgroundColor: "white",
                      borderRadius: "20px",
                      boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
                      minHeight: "200px",
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
                        backgroundColor: "#1E1B4B",
                      }}
                    >
                      {servicio.nombre}
                    </Card.Header>
                    <Card.Body>
                      <Row className="g-0 align-items-center h-100">
                        <Col xs={12} md={4} className="text-center">
                          <img
                            src={servicio.logoURL || placeholderImage}
                            alt={servicio.nombre}
                            style={{
                              width: "100%",
                              maxWidth: "120px",
                              height: "120px",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          />
                        </Col>
                        <Col xs={12} md={8}>
                          <Card.Body style={{ padding: "20px 15px" }}>
                            <p>
                              <strong>Categoría:</strong>{" "}
                              {servicio.categoria?.nombre}
                            </p>
                            <p>
                              <strong>Calificación:</strong>{" "}
                              {renderStars(servicio.resumen?.calificacion)} (
                              {servicio.resumen?.cantResenias})
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
                                {servicio.ubicacion}{" "}
                                <i className="bi bi-geo-alt-fill"></i>
                              </a>
                            </p>
                            <p>
                              <strong>Instructor:</strong>{" "}
                              {servicio.instructorNombre}
                            </p>
                          </Card.Body>

                          <div
                            className="d-flex align-items-center flex-column flex-md-row justify-content-between"
                            style={{ marginLeft: "15px" }}
                          >
                            <p className="mb-0 me-md-auto">
                              <strong>Desde:</strong>
                              <strong style={{ fontSize: "1.5rem" }}>
                                {" "}
                                {armarStringPrecioYFrecuenciaCobro(
                                  servicio.montoMinimo,
                                  servicio.tipoFrecuenciaPago?.cantCiclo,
                                  servicio.tipoFrecuenciaPago?.unidadCiclo
                                )}{" "}
                              </strong>
                            </p>
                            <Button
                              size="sm"
                              style={{
                                backgroundColor: "#4F46E5",
                                borderColor: "#4F46E5",
                              }}
                              onClick={() =>
                                navigate(
                                  `/alumno/${idAlumno}/servicio/${servicio.id}/info-servicio`
                                )
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
        )}
      </Card>
    </Container>
  );
};

export default DescubrirServicios;
