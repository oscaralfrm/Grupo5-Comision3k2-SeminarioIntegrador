import React, { useState, useEffect } from 'react';
import ServiceHeader from "./SeviceHeader";
import GruposServicio from "./GruposServicio";
import MontosServicio from "./Monto/MontosServicio";
import ReviewCarousel from "../MiServicio/MenuOpciones/Dashboard/Reseñas";
import { Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from 'react-router-dom';
import { getServicioById } from '../../../services/Servicio';


const InfoServicioPage = () => {
    const { idServicio } = useParams();
    const [serviceData, setServiceData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServicio = async () => {
          try {
            const data = await getServicioById(idServicio);
            setServiceData(data);
          } catch (error) {
            console.error('Error al traer el servicio:', error);
          }
        };
        fetchServicio();
      }, [idServicio]);

    return (
        <div className="container mt-4" style={{fontFamily:"Roboto"}}>
            {/* Servicio Header */}
            <ServiceHeader serviceData={serviceData} setServiceData={setServiceData} />

            {/* Acerca de las clases y Montos */}
            <Row className="mt-4">
                {/* Columna izquierda: Acerca de las clases */}
                <Col md={6}>
                    <div className="p-3 bg-light rounded shadow-sm">
                        <h4 className="fw-bold mb-3">Acerca de las Clases</h4>
                        <p>
                            {serviceData?.descripcion}
                        </p>
                    </div>
                </Col>

                {/* Columna derecha: Montos del servicio */}
                <Col md={6}>
                    <MontosServicio />
                </Col>
            </Row>

            {/* Grupos y Horarios */}
            <Row className="mt-4">
                <Col>
                    <GruposServicio />
                </Col>
            </Row>

            {/* Reseñas */}
            <Row className="mt-4">
                <Col>
                    <div className="p-3 bg-light rounded shadow-sm">
                        <h4 className="fw-bold mb-3">Reseñas</h4>
                        <ReviewCarousel />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default InfoServicioPage;
