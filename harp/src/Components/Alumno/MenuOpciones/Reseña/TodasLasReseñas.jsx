import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import ReseniaCard from "./ReseñaCard";

const TodasLasResenias = ({ todasResenias, idInscripcion }) => {
  const [filters, setFilters] = useState({
    calificacion: null,
    orden: "recientes", // "recientes" o "antiguas"
  });

  const [reseñasFiltradas, setReseñasFiltradas] = useState([]);

  // Aplicar filtros cuando cambie el orden o todasResenias
  useEffect(() => {
    let reseñasFiltradas = [...todasResenias];

    // Ordenar las reseñas por fecha_hora
    if (filters.orden === "recientes") {
      reseñasFiltradas.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
    } else if (filters.orden === "antiguas") {
      reseñasFiltradas.sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));
    }

    // Filtrar por calificación
    if (filters.calificacion) {
      reseñasFiltradas = reseñasFiltradas.filter(
        (review) => review.calificacion === filters.calificacion
      );
    }

    setReseñasFiltradas(reseñasFiltradas);
  }, [filters.orden, filters.calificacion, todasResenias]); // Dependencias: filters.orden, filters.calificacion y todasResenias

  // Función para manejar el cambio de calificación
  const handleCalificacionChange = (calificacion) => {
    setFilters({ ...filters, calificacion });
  };

  return (
    <Row className="mb-4">
      <Col>
        <h4 className="text-center" style={{ color: "#1E1B4B", fontFamily: "Roboto, sans-serif" }}>
          Todas las Reseñas del Servicio
        </h4>

        <InputGroup className="mb-3" style={{ backgroundColor: "#e9ecef", padding: "10px", borderRadius: "10px", boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.1)" }}>
          {/* Filtro por calificación */}
          <InputGroup.Text style={{ backgroundColor: "#ffffff", border: "none" }}>Calificación</InputGroup.Text>
          <div style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                color={star <= filters.calificacion ? "#ffc107" : "#e4e5e9"}
                onClick={() => handleCalificacionChange(star)}
                style={{ cursor: "pointer", marginRight: "5px" }}
              />
            ))}
          </div>

          {/* Filtro por antigüedad */}
          <Form.Select
            value={filters.orden}
            onChange={(e) => setFilters({ ...filters, orden: e.target.value })}
            style={{ marginLeft: "10px", width: "auto", backgroundColor: "#ffffff", border: "none" }}
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguas">Más antiguas</option>
          </Form.Select>

          {/* Botón para resetear filtros */}
          <Button
            variant="secondary"
            onClick={() => setFilters({ calificacion: null, orden: "recientes" })}
            style={{ marginLeft: "10px", backgroundColor: "#1E1B4B", border: "none" }}
          >
            Resetear
          </Button>
        </InputGroup>

        {reseñasFiltradas.length === 0 ? (
          <p className="text-center">No hay reseñas disponibles.</p>
        ) : (
          <Row>
            {reseñasFiltradas.map((review) => (
              <Col key={review.id} md={6} className="mb-4">
                <ReseniaCard review={review} />
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default TodasLasResenias;