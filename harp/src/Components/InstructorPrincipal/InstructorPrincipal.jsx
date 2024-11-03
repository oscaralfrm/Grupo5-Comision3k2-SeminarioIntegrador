import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

    setTimeout(() => setHarpVisible(true), 500);
    setTimeout(() => {
      setServicesVisible(true);
      setTimeout(() => {
        // Mostrar todas las cards a la vez
        setVisibleCards([...serviceCards, { id: 'add', title: '+', description: 'Agregar' }]);
      }, 500); // Retraso de 500 ms después de "Tus Servicios"
    }, 1500);
  }, []);

  const handleCardClick = (id) => {
    if (id === 'add') {
      navigate("/servicio/crear-servicio");
    } else {
      navigate(`/servicio/${id}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#E6E6FA', height: "100vh", padding: '2rem', fontFamily: 'Roboto', width: '100vw' }}>
      <div style={{ textAlign: 'center', opacity: isHarpVisible ? 1 : 0, transition: 'opacity 0.5s ease-in-out', color: 'black', padding: '1rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Harp</h1>
      </div>
      <div style={{ textAlign: 'center', opacity: isServicesVisible ? 1 : 0, transition: 'opacity 0.5s ease-in-out', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', position: 'relative' }}>
        <div style={{ padding: '1rem', borderRadius: '8px', opacity: isServicesVisible ? 1 : 0, transition: 'opacity 0.5s ease-in-out', position: 'relative' }}>
          <h2 style={{ color: '#4F46E5', margin: 0 }}>Tus Servicios</h2>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: '1rem' }}>
          {visibleCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="custom-card"
              style={{
                opacity: visibleCards.length > 0 ? 1 : 0,
                width: '6vw',
                minHeight: '5vw',
                margin: '1vw',
              }}
            >
              <div className="icon-container"></div>
              <h3 className='text-center'>{card.title}</h3>
              <p className='text-center'>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorPrincipal;
