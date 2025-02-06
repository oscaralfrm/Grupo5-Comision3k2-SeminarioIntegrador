import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { getAllServiciosPublicosSinAlumno } from "../../services/Servicio";
import placeholderImage from '../../assets/placeholderForServices.png';

const DescubrirServicios = () => {
    const { idAlumno } = useParams();
    const navigate = useNavigate();
    const [servicios, setServicios] = useState([]);
    const [totalServicios, setTotalServicios] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(20);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await getAllServiciosPublicosSinAlumno(0, 1000, idAlumno);
                setServicios(response.content);
                setTotalServicios(response.totalElements);
            } catch (error) {
                console.error("Error al obtener servicios:", error);
            }
        };
        fetchServicios();
    }, []);

    const filteredServicios = servicios.filter(servicio =>
        servicio.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedServicios = filteredServicios.slice(page * size, (page + 1) * size);
    const totalPages = Math.ceil(filteredServicios.length / size);

    return (
        <Container style={{ marginTop: '80px' }}>
            <Card style={{ padding: '20px', borderRadius: '10px' }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1E1B4B" }}>Descubrir Servicios</h2>

                {/* Barra de búsqueda */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: '30px' }}>
                    <input
                        type="text"
                        placeholder="Buscar servicios..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0);
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

                <Row className="justify-content-center">
                    {paginatedServicios.length === 0 ? (
                        <p>No se encontraron servicios.</p>
                    ) : (
                        paginatedServicios.map(servicio => (
                            <Col xs={12} md={10} key={servicio.id} style={{ marginBottom: '20px' }}>
                                <Card
                                    style={{
                                        border: 'none',
                                        backgroundColor: 'white',
                                        borderRadius: '20px',
                                        boxShadow: '0px 4px 19px rgba(0, 0, 0, 0.5)',
                                        minHeight: '200px'
                                    }}
                                >
                                    <Card.Header style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', padding: '15px' }}>
                                        {servicio.nombre}
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className="g-0 align-items-center h-100">
                                            <Col xs={12} md={4} className="text-center">
                                            
                                                <img
                                                    src={servicio.logoURL || placeholderImage}
                                                    alt={servicio.nombre}
                                                    style={{
                                                        width: '100%',
                                                        maxWidth: '120px',
                                                        height: '120px',
                                                        objectFit: 'cover',
                                                        borderRadius: '10px'
                                                    }}
                                                />

                                            </Col>
                                            <Col xs={12} md={8}>
                                                <Card.Body style={{ padding: '20px 15px' }}>
                                                    <p><strong>Instructor:</strong> {servicio.instructor}</p>
                                                    <p><strong>Categoría:</strong> {servicio.categoria?.nombre}</p>
                                                    <p><strong>Ubicación:</strong> {servicio.ubicacion}</p>
                                                    <p><strong>Calificación:</strong> {servicio.calificacion}</p>
                                                    <div className="d-flex flex-wrap justify-content-end">
                                                        <Button
                                                            size="sm"
                                                            className="me-2 mb-2"
                                                            style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}
                                                            onClick={() => navigate(`/alumno/${idAlumno}/servicio/${servicio.id}/info-servicio`)}
                                                        >
                                                            Ver más
                                                        </Button>
                                                    </div>
                                                </Card.Body>
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
                            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                        >
                            Anterior
                        </Button>
                        <span className="mx-3">Página {page + 1} de {totalPages}</span>
                        <Button
                            style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(prev => prev + 1)}
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