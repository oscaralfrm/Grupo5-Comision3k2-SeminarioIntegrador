import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetallesDeServicio } from "../../services/Servicio";
import { Card, Button, Spinner, Row, Col } from "react-bootstrap";
import placeholderImage from "../../assets/placeholderForServices.png";

const InformacionDelServicio = () => {
    const { idServicio } = useParams();
    const [servicio, setServicio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServicio = async () => {
            try {
                const data = await getDetallesDeServicio(idServicio);
                setServicio(data);
            } catch (error) {
                console.error("Error al obtener la información del servicio", error);
                setError("No se pudo obtener la información del servicio.");
            } finally {
                setLoading(false);
            }
        };
        fetchServicio();
    }, [idServicio]);

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">{error}</div>;
    }

    if (!servicio) {
        return <div className="text-center mt-5 text-danger">Servicio no encontrado</div>;
    }

    return (
        <div className="container mt-5">
            <Card className="shadow-lg rounded-4 mb-4">
                <Card.Img
                    variant="top"
                    src={servicio.logoURL || placeholderImage}
                    style={{ height: "250px", objectFit: "cover" }}
                    className="rounded-top"
                />
                <Card.Body>
                    <Card.Title className="text-center" style={{ color: "#1E1B4B" }}>{servicio.nombre}</Card.Title>
                    <Card.Text className="mt-3">{servicio.descripcion}</Card.Text>
                    <div className="d-flex justify-content-center gap-3">
                        <Button style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}>Inscribirme</Button>
                        <Button variant="secondary" onClick={() => window.history.back()}>Volver</Button>
                    </div>
                </Card.Body>
            </Card>
            <Row>
                <Col md={6}>
                    <Card className="shadow-sm rounded-4 mb-4">
                        <Card.Body>
                            <Card.Title>Detalles del Servicio</Card.Title>
                            <Card.Text><strong>Duración Total:</strong> {servicio.duracion || "No disponible"}</Card.Text>
                            <Card.Text><strong>Cupos Disponibles:</strong> {servicio.cuposLibres || "No disponible"}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="shadow-sm rounded-4 mb-4">
                        <Card.Body>
                            <Card.Title>Ingresos</Card.Title>
                            <Card.Text><strong>Ingresos Pendientes:</strong> {servicio.ingresosPendientes?.pendiente || 0}</Card.Text>
                            <Card.Text><strong>Ingresos Esperados:</strong> {servicio.ingresosPendientes?.esperado || 0}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Card className="shadow-sm rounded-4">
                <Card.Body>
                    <Card.Title>Ingresos por Mes</Card.Title>
                    {servicio.ingresosPorMes?.length > 0 ? (
                        <ul>
                            {servicio.ingresosPorMes.map((ingreso, index) => (
                                <li key={index}><strong>{ingreso.mes}:</strong> {ingreso.total}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay datos de ingresos mensuales</p>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default InformacionDelServicio;
