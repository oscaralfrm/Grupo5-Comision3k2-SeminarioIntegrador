import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import img from "../../assets/Logo.png";

const InstructorPrincipal = () => {
  const { idInstructor } = useParams();
  const [isHarpVisible, setHarpVisible] = useState(false);
  const [isServicesVisible, setServicesVisible] = useState(false);
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const serviceCards = [
      { id: 1, title: "Servicio 1", description: "Descripción del servicio 1" },
      { id: 2, title: "Servicio 2", description: "Descripción del servicio 2" },
      { id: 3, title: "Servicio 3", description: "Descripción del servicio 3" },
    ];
    setCards(serviceCards);

    // Muestra el logo y el título "Harp"
    setTimeout(() => setHarpVisible(true), 500);

    // Después de mostrar el título, muestra "Tus Servicios"
    setTimeout(() => {
      setServicesVisible(true);
      setTimeout(() => {
        // Mostrar todas las cards a la vez
        setVisibleCards([
          ...serviceCards,
          { id: "add", title: "+", description: "Agregar" },
        ]);
      }, 500); // Retraso de 500 ms después de "Tus Servicios"
    }, 1500);
  }, []);

  const handleCardClick = (id) => {
    if (id === "add") {
      navigate(`/instructor/${idInstructor}/crear-servicio`);
    } else {
      navigate(`/instructor/${idInstructor}/servicio/${id}`);
    }
  };

  return (
    <div 
      style={{
        backgroundColor: "#E6E6FA",
        padding: "2rem",
        fontFamily: "Roboto",
        width: "100vw",
        height: '100vh'
        
      }}
    >
      {/* Sección de "Tus Servicios" */}
      <div
        style={{
          textAlign: "center",
          opacity: isServicesVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
          position: "relative",
          backgroundColor:'white',
          height:'100%'

        }}
      >
        {/* Sección del logo y título */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            opacity: isHarpVisible ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            filter: 'drop-shadow(1px 1px 1px #000000)'
          }}
        >
          <img
            src={img}
            alt="Logo Harp"
            style={{
              width: "60px", // Ajusta el tamaño según lo necesites
              height: "60px",
              objectFit: "contain",
              marginTop: "-1vw",
            }}
          />
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#333",
              marginLeft: "10px", // Espacio entre el título y el logo
              fontFamily: "Roboto",
            }}
          >
            Harp
          </h1>
        </div>
        <div
          style={{
            padding: "1rem",
            borderRadius: "8px",
            opacity: isServicesVisible ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            position: "relative",
          }}
        >
          <h2 style={{ color: "Black",fontFamily:"Roboto", margin: 0,filter: 'drop-shadow(0px 1px 2px #000000)' }}>Tus Servicios</h2>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            marginTop: "1rem",
          }}
        >
          {visibleCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="custom-card"
              style={{
                opacity: visibleCards.length > 0 ? 1 : 0,
                width: "6vw",
                minHeight: "5vw",
                margin: ".5vw",
                boxShadow:" 0 4px 8px rgba(0,0,0,0.4) "
              }}
            >
              <div className="icon-container"></div>
              <h3 className="text-center">{card.title}</h3>
              <p className="text-center">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorPrincipal;
