import React from "react";
import { Card, Button, Image } from "react-bootstrap";
import { FaStar, FaEdit, FaCheck, FaTrash } from "react-icons/fa";

const ReseniaCard = ({
  review,
  handleEdit,
  handlePublish,
  handleDelete,
  idAlumno,
}) => {
  // Función para extraer y formatear la fecha desde fechaHora
  const formatDate = (fechaHora) => {
    if (!fechaHora) {
      return "Fecha no disponible"; // Manejo de fechas inválidas o undefined
    }

    // Extraer solo la parte de la fecha (antes de la "T")
    const fecha = fechaHora.split("T")[0];
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`; // Formato dd/mm/yyyy
  };

  // Función para renderizar las estrellas de calificación
  const renderStars = (rating) => {
    const safeRating = Math.min(Math.max(rating, 0), 5);
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        color={i < safeRating ? "#ffc107" : "#e4e5e9"}
        style={{ fontSize: "1.2rem" }} // Tamaño de estrellas aumentado
      />
    ));
  };

  return (
    <Card
      className="mb-3" // Reducir el margen inferior
      style={{
        borderRadius: "20px",
        boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.1)",
        border: "none",
        backgroundColor: "#e9ecef", // Fondo gris más oscuro
        fontFamily: "Roboto, sans-serif",
        height: "240px", // Alto fijo para todas las tarjetas
        width: "100%", // Ocupar el 100% del ancho de la columna
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Card.Body
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "15px", // Aumentar el padding para más espacio
        }}
      >
        <div className="d-flex align-items-center mb-2">
          <Image
            src={review.alumno.usuario.fotoPerfilURL || "ruta/por/defecto.jpg"}
            roundedCircle
            width="50" // Aumentar el tamaño de la imagen
            height="50"
            className="me-2"
            style={{ border: "2px solid #1E1B4B" }}
          />
          <div>
            <Card.Title
              className="mb-0"
              style={{ color: "#1E1B4B", fontWeight: "bold", fontSize: "1.1rem" }} // Aumentar el tamaño del título
            >
              {review.alumno.nombreCompleto}
            </Card.Title>
            <small className="text-muted" style={{ fontSize: "0.9rem" }}> {/* Aumentar el tamaño de la fecha */}
              {formatDate(review.fechaHora)} {/* Fecha formateada */}
            </small>
          </div>
        </div>
        <div className="mb-2" style={{ color: "#ffc107" }}>
          {renderStars(review.calificacion)}
        </div>
        <Card.Text
          style={{
            fontSize: "1rem", // Aumentar el tamaño del texto
            color: "#333",
            flex: 1,
            overflow: "hidden", // Evitar que el texto se desborde
            textOverflow: "ellipsis", // Mostrar puntos suspensivos si el texto es muy largo
          }}
        >
          {review.mensaje}
        </Card.Text>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          {!review.publicada && (
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={() => handleEdit(review)}
                style={{ flex: 1, fontSize: "0.9rem", padding: "8px" }} // Aumentar el tamaño del botón
              >
                <FaEdit /> Editar
              </Button>
              <Button
                variant="success"
                onClick={() => handlePublish(review.id)}
                style={{ flex: 1, fontSize: "0.9rem", padding: "8px" }} // Aumentar el tamaño del botón
              >
                <FaCheck /> Publicar
              </Button>
            </div>
          )}
          {handleDelete && (
            <Button
              variant="danger"
              onClick={() => handleDelete(review.id)}
              style={{ fontSize: "0.9rem", padding: "8px" }} // Aumentar el tamaño del botón
            >
              <FaTrash /> Eliminar
            </Button>
          )}
          {/* Espacio reservado para tarjetas sin botones */}
          {review.publicada && !handleDelete && (
            <div style={{ height: "30px" }}></div> // Espacio para compensar la falta de botones
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReseniaCard;