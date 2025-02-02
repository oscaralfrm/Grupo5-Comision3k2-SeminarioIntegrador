import React, { useEffect, useState } from "react";
// import { getDetallesDeServicio } from "../../services/Servicio";
import placeholderImage from "../../assets/placeholderForServices.png";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { getAllServicios } from "../../services/Servicio";

const DescubrirServicios = () => {
    const { idAlumno } = useParams();
    const navigate = useNavigate();
    const [servicios, setServicios] = useState([]);
    const [totalServicios, setTotalServicios] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await getAllServicios(0, 1000);
                setServicios(response.content);
                setTotalServicios(response.totalElements);
            } catch (error) {
                console.error("Error al obtener servicios:", error);
            }
        };
        fetchServicios();
    }, []);

    const filteredServicios = servicios.filter(servicio =>
        servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedServicios = filteredServicios.slice(page * size, (page + 1) * size);

    return (
        <Container style={{ marginTop: '80px' }}>
            <Card style={{ backgroundColor: 'rgba(165, 180, 252, 0.5)', padding: '20px', borderRadius: '10px' }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1E1B4B" }}>Descubrir Servicios</h2>

                {/* Barra de búsqueda */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: '30px' }}>
                    <input
                        type="text"
                        placeholder="Buscar servicios..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0); // Reset a la primera página al buscar
                        }}
                        style={{
                            padding: '10px',
                            width: '100%',
                            maxWidth: '400px',
                            borderRadius: '10px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                <Row>
                    {paginatedServicios.length === 0 ? (
                        <p>No se encontraron servicios.</p>
                    ) : (
                        paginatedServicios.map(servicio => (
                            <Col xs={12} md={6} key={servicio.id}>
                                <Card style={{ marginBottom: '20px', border: 'none' }}>
                                    <Row className="g-0 align-items-center">
                                        <Col xs={12} md={4} className="text-center">
                                            <img
                                                src={servicio.logoURL || placeholderImage}
                                                alt={servicio.nombre}
                                                style={{
                                                    width: '100%',
                                                    maxWidth: '120px',
                                                    height: 'auto',
                                                    objectFit: 'cover',
                                                    borderRadius: '10px'
                                                }}
                                            />
                                        </Col>
                                        <Col xs={12} md={8}>
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title className="mb-1">{servicio.nombre}</Card.Title>
                                                <Card.Text className="text-muted small">{servicio.descripcion}</Card.Text>
                                                <div className="d-flex flex-wrap justify-content-end mt-auto">
                                                    <Button
                                                        size="sm"
                                                        className="me-2 mb-2"
                                                        style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}
                                                        onClick={() => navigate(`/alumno/${idAlumno}/servicios/${servicio.id}/detalles`)}
                                                    >
                                                        Ver más
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="mb-2"
                                                        style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}
                                                        onClick={() => navigate(`/alumno/${idAlumno}/servicios/${servicio.id}/inscribirme`)}
                                                    >
                                                        Inscribirme
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>

                {/* Paginación */}
                <div className="pagination d-flex justify-content-center mt-3">
                    <Button
                        style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}
                        disabled={page === 0}
                        onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                    >
                        Anterior
                    </Button>
                    <span className="mx-3">Página {page + 1} de {Math.ceil(filteredServicios.length / size)}</span>
                    <Button
                        style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}
                        disabled={page >= Math.ceil(filteredServicios.length / size) - 1}
                        onClick={() => setPage(prev => prev + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default DescubrirServicios;
