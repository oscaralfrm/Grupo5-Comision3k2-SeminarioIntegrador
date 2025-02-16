import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import ServiciosPreviewSection from "./ServiciosPreviewSection"; // Ajusta la ruta según corresponda

const WelcomeBlock = () => {
  const welcomeRef = useRef(null);
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const { idInstructor } = useParams();

  const cardHeight = "260px";

  const handleAddNewService = () => {
    navigate(`/instructor/${idInstructor}/crear-servicio`);
  };

  useEffect(() => {
    if (welcomeRef.current) {
      welcomeRef.current.animate(
        [
          { opacity: 0, transform: "translateY(-20px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        {
          duration: 1500,
          easing: "ease",
          fill: "forwards"
        }
      );
    }
  }, []);

  return (
    <Container>
      {/* Primera fila */}
      <Row
        className="g-3 align-items-stretch"
        style={{
          minHeight: "500px",
          backgroundImage: "linear-gradient(to right, #1E1B4B, #4F46E5)",
          borderRadius: "20px",
          boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.5)"
        }}
      >
        {/* Cartel de bienvenida */}
        <Col xs={12} md={6}>
          <div
            ref={welcomeRef}
            style={{
              padding: "40px",
              borderRadius: "10px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <h1 style={{ color: "white", fontSize: "3rem", marginBottom: "20px" }}>
              Bienvenido a Harp
            </h1>
            <p style={{ fontSize: "1.2rem", color: "white", lineHeight: "1.5" }}>
              Parece que aún no has configurado ningún servicio. Aquí podrás crear y
              configurar un servicio completo: grupos, horarios, precio y más. Una vez
              que publiques tu servicio, los alumnos podrán solicitar inscribirse.
              ¡Empieza ahora y transforma tu experiencia!
            </p>
          </div>
        </Col>

        {/* Card para agregar un nuevo servicio */}
        <Col xs={12} md={6} className="d-flex justify-content-center align-items-center p-3">
          <Card
            style={{
              padding: "15px",
              backgroundColor: "#E8F8FF",
              borderRadius: "20px",
              height: cardHeight,
              fontFamily: "Roboto",
              maxWidth: "350px",
              width: "100%",
              textAlign: "center",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transition: "transform 0.3s",
              transform: hover ? "scale(1.05)" : "scale(1)"
            }}
            onClick={handleAddNewService}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                backgroundColor: "#4a47a3",
                marginBottom: "15px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                  color: "#fff",
                  fontWeight: "bold"
                }}
              >
                +
              </span>
            </div>
            <h4
              className="card-title"
              style={{ fontSize: "1.15rem", color: "#333", fontWeight: "bold" }}
            >
              Agregar Servicio
            </h4>
          </Card>
        </Col>
      </Row>

      {/* Segunda fila: Sección de preview */}
      <Row
        className="g-3 align-items-stretch mt-4"
        style={{
          backgroundImage: "linear-gradient(to right, #1E1B4B, #4F46E5)",
          borderRadius: "20px",
          boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.5)",
          padding: "20px"
        }}
      >
        <Col xs={12}>
          <ServiciosPreviewSection />
        </Col>
      </Row>
    </Container>
  );
};

export default WelcomeBlock;
