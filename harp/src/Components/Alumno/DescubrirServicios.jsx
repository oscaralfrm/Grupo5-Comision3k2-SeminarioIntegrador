import React, { useEffect, useState } from "react";
import placeholderImage from "../../assets/placeholderForServices.png";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { getAllServiciosPublicosSinAlumno } from "../../services/Servicio";
import { FaStar, FaRegStar } from "react-icons/fa";

const DescubrirServicios = () => {
  const { idAlumno } = useParams();
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [totalServicios, setTotalServicios] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

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
      try {
        const response = await getAllServiciosPublicosSinAlumno(
          page,
          size,
          idAlumno
        );
        setServicios(response);
        setTotalServicios(response.length);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      }
    };
    fetchServicios();
  }, [page, idAlumno, size]);

  const filteredServicios = servicios.filter((servicio) =>
    servicio.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedServicios = filteredServicios.slice(
    page * size,
    (page + 1) * size
  );
  const totalPages = Math.ceil(filteredServicios.length / size);

  return (
    <Container style={{ marginTop: "20vh" }}>
      <Card style={{ padding: "20px", borderRadius: "10px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
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

        <Row className="justify-content-center">
          {paginatedServicios.length === 0 ? (
            <p>No se encontraron servicios.</p>
          ) : (
            paginatedServicios.map((servicio) => (
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
                            <strong>Instructor:</strong>{" "}
                            {servicio.instructorNombre}
                          </p>
                          <p>
                            <strong>Categoría:</strong>{" "}
                            {servicio.categoria?.nombre}
                          </p>
                          <p className="mb-4">
                            <strong>Ubicación:</strong> {servicio.ubicacion}
                          </p>
                        </Card.Body>

                        <div
                          className="d-flex flex-wrap"
                          style={{
                            position: "relative", // Contenedor relativo para el posicionamiento absoluto del botón
                            height: "100%", // Ajusta la altura del contenedor para asegurarse de que haya espacio suficiente
                          }}
                        >
                          {/* Estrellas alineadas en eje Y */}
                          <p
                            className="d-flex justify-items-center align-items-center"
                            style={{
                              fontSize: ".5rem",
                              position: "absolute",
                              bottom: "3px", // Ajusta la distancia desde el fondo de la tarjeta
                              left: "15px", // Ajusta la distancia desde la izquierda de la tarjeta
                              display: "flex",
                              alignItems: "center", // Alineación vertical centrada
                            }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {isNaN(Number(servicio.resumen?.calificacion)) ||
                              servicio.resumen?.calificacion <= 0
                                ? 0
                                : servicio.resumen?.calificacion}
                            </span>

                            <span
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {renderStars(
                                isNaN(Number(servicio.resumen?.calificacion)) ||
                                  servicio.resumen?.calificacion <= 0
                                  ? 0
                                  : servicio.resumen?.calificacion
                              )}
                            </span>

                            <span style={{ marginLeft: "5px" }}>
                              ({servicio.resumen?.cantResenias})
                            </span>
                          </p>

                          {/* Botón a la derecha del todo */}
                          <div className="d-flex flex-wrap justify-content-end mb-2">
                            <Button
                              size="sm"
                              style={{
                                backgroundColor: "#4F46E5",
                                borderColor: "#4F46E5",
                                position: "absolute", // Posiciona el botón de forma absoluta dentro del contenedor
                                bottom: "10px", // Ajusta la distancia desde el fondo de la tarjeta
                                right: "10px", // Ajusta la distancia desde la derecha de la tarjeta
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
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination d-flex justify-content-center mt-3">
            <Button
              style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}
              disabled={page === 0}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            >
              Anterior
            </Button>
            <span className="mx-3">
              Página {page + 1} de {totalPages}
            </span>
            <Button
              style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}
              disabled={page >= totalPages - 1}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default DescubrirServicios;
