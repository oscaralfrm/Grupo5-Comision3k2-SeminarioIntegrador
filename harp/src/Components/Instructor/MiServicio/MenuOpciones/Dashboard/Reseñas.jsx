import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { getReseniasDeServicio } from "../../../../../services/Reseñas";
import { useParams } from "react-router-dom";
import { Card, Row, Col, Container, Button, Modal, Form } from "react-bootstrap";


const ReviewCarousel = ({resenias}) => {
  const { idServicio } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (resenias) {
          console.log("resenias", resenias);
          setReviews(resenias);
        } else {
          const data = await getReseniasDeServicio(idServicio);
          setReviews(data);
        }
      } catch (err) {
        setError("Error al cargar las reseñas.");
      } finally {
        setLoading(false);
      }
    };

      fetchReviews();
  }, [idServicio]);

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
    maxWidth: "100%",
    marginTop: "3vh",
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
    height: "auto",
  };

  const renderStars = (rating) => {
    const safeRating = Math.min(Math.max(rating || 0, 0), 5); // Asegura que rating esté entre 0 y 5
    return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
  };

  return (
    <Container
      className="p-3"
      style={{
        maxWidth: "100%",
        margin: "auto",
        fontFamily: "Roboto",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
        minHeight: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "#1E1B4B",
          padding: "10px",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "10px",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          color: "white",
          position: "relative",
        }}
      >
        <h4 className="fw-bold mb-2 mt-2 text-center">Reseñas</h4>
      </div>

      {loading ? (
        <p>Cargando reseñas...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : reviews.length === 0 ? (
        <p>No hay reseñas disponibles.</p>
      ) : (
        <Carousel variant="dark" interval={3000} indicators={false} controls={true}>
          {reviews.map((review) => (
            <Carousel.Item key={review.id} style={{ padding: "20px" }}>
              <div style={{ textAlign: "center", padding: "10px 20px" }}>
                <p
                  className="mt-0"
                  style={{ fontSize: "16px", color: "#4F46E5", fontWeight: "bold" }}
                >
                  {review.alumno.nombreCompleto}
                </p>
                <p style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}>
                  {review.mensaje}
                </p>
                <p style={{ fontSize: "14px", color: "#ffa500", marginBottom: "30px" }}>
                  {renderStars(review?.calificacion)}
                </p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </Container>
  );
};

export default ReviewCarousel;