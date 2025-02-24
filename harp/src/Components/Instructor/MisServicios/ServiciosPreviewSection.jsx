import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllServiciosPublicos, getServiciosPublicosConLogo } from '../../../services/Servicio';
import serviceImg from "../../../assets/placeholderForServices.png"

const ServiciosPreviewSection = () => {
  const navigate = useNavigate();
  const { idInstructor } = useParams();
  const [servicios, setServicios] = useState([]);
  const [containerWidth, setContainerWidth] = useState(907);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const gap = 16;

  // Actualiza el ancho del contenedor y el flag de mobile según el tamaño de la ventana.
  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 768) {
        setContainerWidth(window.innerWidth - 40);
        setIsMobile(true);
      } else {
        setContainerWidth(907);
        setIsMobile(false);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Calcula el ancho y alto de cada card.
  const cardWidth = ((containerWidth - 2 * gap) * 2) / 7;
  const cardHeight = cardWidth * 0.8;

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await getServiciosPublicosConLogo(4);
        setServicios(data);
      } catch (error) {
        console.error("Error fetching servicios:", error);
      }
    };

    fetchServicios();
  }, [idInstructor]);

  const handleDiscover = () => {
    navigate(`/instructor/${idInstructor}/descubrir-servicios`);
  };

  // Estilos para el botón "Descubrir" en desktop (posición absoluta sobre las cards)
  const discoverButtonStyleDesktop = {
    background: "#4F46E5",
    color: 'white',
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 3,
  };

  // Estilos para el botón en mobile (se posiciona de forma relativa y, gracias al flex-wrap, se ubicará debajo si es necesario)
  const discoverButtonStyleMobile = {
    background: "#4F46E5",
    color: 'white',
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    marginTop: '10px'
  };

  // Renderizado común de las cards de servicio.
  // Se muestra el nombre (Card.Title) solo si el ancho de la card es mayor a 150px.
  const renderCards = (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        maxWidth: `${containerWidth}px`,
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', gap: `${gap}px` }}>
        {servicios?.map((servicio) => (
          <Card
            key={servicio.id}
            className="preview-card"
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "15px",
              overflow: "hidden",
              position: "relative",
              height: `${cardHeight}px`,
              width: `${cardWidth}px`,
              flexShrink: 0,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            {/* Imagen de fondo desenfocada */}
            <Card.Img
              variant="top"
              src={servicio.logoURL || serviceImg}
              alt={servicio.nombre}
              style={{
                filter: "blur(3px)",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
              }}
            />
            {/* Capa superpuesta */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            />
            {/* Si la card es lo suficientemente ancha, se muestra el nombre */}
            {cardWidth > 150 && (
              <Card.Body
                style={{
                  position: "relative",
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0.5rem",
                }}
              >
                <Card.Title style={{ color: "#333", fontWeight: "bold" }}>
                  {servicio.nombre}
                </Card.Title>
              </Card.Body>
            )}
          </Card>
        ))}
      </div>
      {/* En desktop, el botón "Descubrir" se posiciona sobre las cards */}
      {!isMobile && (
        <button
          onClick={handleDiscover}
          style={discoverButtonStyleDesktop}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
          }}
        >
          Descubrir
        </button>
      )}
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          {/* Layout mobile: El contenedor del título y el botón usa flex-wrap para que, si el espacio es insuficiente, el botón pase a la línea de abajo */}
          <Row style={{ padding: '20px' }}>
            <Col xs={12}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <h2
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    margin: 0,
                    flexGrow: 1,
                    minWidth: '200px'
                  }}
                >
                  Conoce otros instructores y servicios publicados
                </h2>
                <button
                  onClick={handleDiscover}
                  style={discoverButtonStyleMobile}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
                  }}
                >
                  Descubrir
                </button>
              </div>
            </Col>
          </Row>
          <Row style={{ padding: '0 20px 20px' }}>
            <Col xs={12}>{renderCards}</Col>
          </Row>
        </>
      ) : (
        // Layout desktop: Título en una columna (nunca superpuesto a las cards) y las cards en otra.
        <Row style={{ padding: '20px' }}>
          <Col xs={12} md={3}>
            <h2 style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>
              Conoce otros instructores y servicios publicados
            </h2>
          </Col>
          <Col xs={12} md={9}>{renderCards}</Col>
        </Row>
      )}
    </>
  );
};

export default ServiciosPreviewSection;
