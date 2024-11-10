import React from "react";
import Carousel from "react-bootstrap/Carousel";

const ReviewCarousel = () => {
  const reviews = [
    { id: 1, author: "Manuel", text: "Excelente servicio, muy profesional.", rating: 5 },
    { id: 2, author: "Laura", text: "Me ayudó mucho en mi aprendizaje.", rating: 4 },
    { id: 3, author: "Carlos", text: "Muy recomendado para principiantes y avanzados.", rating: 5 }
  ];

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: '20px',
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
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div style={cardStyle}>
      <div className='mb-0' style={{ backgroundColor: '#1E1B4B', borderRadius: '8px', width: '100%', padding: '20px' }}>
        <h2 style={{ color: "white", fontSize: '1.5rem' }}>Reseñas</h2>
      </div>
      <Carousel variant="dark" interval={3000} indicators={false} controls={true}>
        {reviews.map((review) => (
          <Carousel.Item key={review.id} style={{ padding: '20px' }}>
            <div style={{ textAlign: "center", padding: "10px 20px" }}>
              <p className="mt-0" style={{ fontSize: "16px", color: "#4F46E5", fontWeight: "bold" }}>
                {review.author}
              </p>
              <p style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}>
                {review.text}
              </p>
              <p style={{ fontSize: "14px", color: "#ffa500", marginBottom: "30px" }}>
                {renderStars(review.rating)}
              </p>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <style>
        {`
          .carousel-control-prev, .carousel-control-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            z-index: 5;
          }

          .carousel-control-prev {
            left: -20px; /* Ajusta esta distancia para mantenerla fija */
          }

          .carousel-control-next {
            right: -20px; /* Ajusta esta distancia para mantenerla fija */
          }

          .carousel-control-prev-icon, .carousel-control-next-icon {
            background-color: rgba(0, 0, 0, 0.5);
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }

          @media (max-width: 768px) {
            h2 {
              font-size: 1.5em;
            }
            p {
              font-size: 1em;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ReviewCarousel;
