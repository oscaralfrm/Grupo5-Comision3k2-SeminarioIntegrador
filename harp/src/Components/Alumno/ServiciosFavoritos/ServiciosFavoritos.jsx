import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import placeholderImage from "../../../assets/placeholderForServices.png";
import { FaStar, FaRegStar } from "react-icons/fa";
import { getServiciosFavoritosDeAlumno } from "../../../services/Alumno";
import { generarLinkMaps } from "../../../services/Servicio";
import { armarStringPrecioYFrecuenciaCobro } from "../../../services/frecuenciaPago";
import FavoriteButton from "../DescubrirServicios/AgregarAFavs";

const ServiciosFavoritos = () => {
    const { idAlumno } = useParams();
    const navigate = useNavigate();
    const [serviciosFavoritos, setServiciosFavoritos] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchServiciosFavoritos = async () => {
        setLoading(true);
        try {
            const response = await getServiciosFavoritosDeAlumno(idAlumno);
            setServiciosFavoritos(response);
        } catch (error) {
            console.error("Error al obtener servicios favoritos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServiciosFavoritos();
    }, [idAlumno]);

    const renderStars = (rating) => {
        const safeRating = Math.min(5, Math.max(0, rating || 0));
        return [1, 2, 3, 4, 5].map((star) =>
            star <= safeRating ? (
                <FaStar key={star} color="#FF9900" size={12} />
            ) : (
                <FaRegStar key={star} color="gray" size={12} />
            )
        );
    };

    return (
        <Container fluid style={{ padding: 0, overflowX: "hidden",  backgroundImage: "linear-gradient(to right,rgb(239, 237, 249),rgb(255, 255, 255))", }}>
            {/* Título para pantallas pequeñas */}

            <Row
                className="d-block d-md-none"
                style={{ marginTop: "100px", marginBottom: "20px" }}
            >
                <Col
                    xs={12}
                    style={{
                        backgroundColor: "#f8f9fa",
                        padding: "20px",
                        textAlign: "center",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "2.5rem", // tamaño ajustado para pantallas pequeñas
                            color: "#1E1B4B",
                            margin: 0,
                        }}
                    >
                        Tus Favoritos
                    </h1>
                </Col>
            </Row>
            <Row>
                <Col
                    md={4}
                    className="d-none d-md-block"
                    style={{
                        padding: "40px 20px",
                        minHeight: "100vh",
                        position: "fixed",
                        top: "250px",
                        left: 0,
                        zIndex: 1000,
                        width: "33.33%",
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "4rem",
                            color: "#1E1B4B",
                            textAlign: "left",
                            margin: 0,
                            fontWeight: "600"
                        }}
                    >
                        Tus
                        <br/>
                         Favoritos
                    </h1>
                </Col>

                <Col
                    xs={12}
                    md={{ span: 8, offset: 4 }}
                    style={{ padding: "20px", marginTop: "100px" }}
                >
                    {loading ? (
                        <div className="d-flex flex-column align-items-center my-5">
                            <Spinner
                                animation="border"
                                role="status"
                                style={{ width: "4rem", height: "4rem", color: "#4F46E5" }}
                            />
                            <p className="mt-3" style={{ color: "#4F46E5", fontWeight: "bold" }}>
                                Cargando servicios favoritos...
                            </p>
                        </div>
                    ) : serviciosFavoritos.length === 0 ? (
                        <p style={{ textAlign: "center" }}>
                            No hay servicios favoritos.
                        </p>
                    ) : (
                        <Row className="justify-content-center">
                            {serviciosFavoritos.map((servicio) => (
                                <Col xs={11} key={servicio.id} className="mb-4">
                                    <Card
                                        style={{
                                            border: "none",
                                            backgroundColor: "white",
                                            borderRadius: "20px",
                                            boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
                                            minHeight: "150px",
                                            position: "relative",
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
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "10px",
                                                    right: "10px",
                                                    zIndex: 10,
                                                }}
                                            >
                                                <FavoriteButton
                                                    servicioId={servicio.id}
                                                    serviciosFavoritos={serviciosFavoritos}
                                                    setServiciosFavoritos={setServiciosFavoritos}
                                                />
                                            </div>
                                        </Card.Header>
                                        <Card.Body style={{ padding: "10px" }}>
                                            <Row className="g-0 align-items-center">
                                                <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                                                    <img
                                                        src={servicio.logoURL || placeholderImage}
                                                        alt={servicio.nombre}
                                                        style={{
                                                            width: "100%",
                                                            maxWidth: "80px",
                                                            height: "80px",
                                                            objectFit: "cover",
                                                            borderRadius: "10px",
                                                        }}
                                                    />
                                                </Col>
                                                <Col xs={12} md={8}>
                                                    <div style={{ padding: "10px 8px" }}>
                                                        <p style={{ fontSize: "0.9rem" }}>
                                                            <strong>Categoría:</strong> {servicio.categoria?.nombre}
                                                        </p>
                                                        <p style={{ fontSize: "0.9rem" }}>
                                                            <strong>Calificación:</strong> {renderStars(servicio.resumen?.calificacion)} ({servicio.resumen?.cantResenias})
                                                        </p>
                                                        <p style={{ fontSize: "0.9rem" }}>
                                                            <strong>Ubicación:</strong> <a href={generarLinkMaps(servicio.ubicacion)} target="_blank" rel="noopener noreferrer" title="Ver en Google Maps" style={{ color: "#0d6efd", fontWeight: "bold" }}>{servicio.ubicacion}</a>
                                                        </p>
                                                        <p style={{ fontSize: "0.9rem" }}>
                                                            <strong>Instructor:</strong> {servicio.instructorNombre}
                                                        </p>
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "8px" }}>
                                                        <p style={{ margin: 0, fontSize: "0.9rem" }}>
                                                            <strong>Desde:</strong> <strong style={{ fontSize: "1.2rem" }}>{armarStringPrecioYFrecuenciaCobro(servicio.montoMinimo, servicio.tipoFrecuenciaPago?.cantCiclo, servicio.tipoFrecuenciaPago?.unidadCiclo)}</strong>
                                                        </p>
                                                        <Button size="sm" style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5", fontSize: "0.8rem" }} onClick={() => navigate(`/alumno/${idAlumno}/servicio/${servicio.id}/info-servicio`)}>
                                                            Ver más
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ServiciosFavoritos;