import React from "react";
import Carousel from "react-bootstrap/Carousel";

const ReviewCarousel = () => {
  const reviews = [
    { id: 1, author: "Manuel", text: "Excelente servicio, muy profesional.", rating: 5 },
    { id: 2, author: "Laura", text: "Me ayudó mucho en mi aprendizaje.", rating: 4 },
    { id: 3, author: "Carlos", text: "Muy recomendado para principiantes y avanzados.", rating: 5 }
  ];

  const cardStyle = {
    backgroundColor: "#eef2ff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "100%",
    margin: "0 auto",
    width: "80%",  // Ajuste de ancho
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ color: "#4a47a3" }}>Reseñas</h2>
      <Carousel variant="dark" interval={3000}>
        {reviews.map((review) => (
          <Carousel.Item key={review.id}>
            <div style={{ textAlign: "center", padding: "10px 20px" }}>
              <p style={{ fontSize: "16px", color: "#4a47a3", fontWeight: "bold" }}>
                {review.author}
              </p>
              <p style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}>
                {review.text}
              </p>
              <p style={{ fontSize: "14px", color: "#ffa500" }}>{renderStars(review.rating)}</p>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Responsive adjustments */}
      <style>
        {`
          @media (max-width: 768px) {
            h2 {
              font-size: 1.5em;
            }
            p {
              font-size: 1em;
            }
            .carousel-control-prev-icon, .carousel-control-next-icon {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ReviewCarousel;
