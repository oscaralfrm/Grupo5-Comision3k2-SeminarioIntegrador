import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const InstructorPrincipal = () => {
  const { idInstructor } = useParams();
  const [selectedService, setSelectedService] = useState("Servicio-Actualizado");
  const [isHarpVisible, setHarpVisible] = useState(false);
  const [isServicesVisible, setServicesVisible] = useState(false);
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);

  const navigate = useNavigate();

  // Simulando servicios
  useEffect(() => {
    const serviceCards = [
      { id: 1, title: "Servicio 1", description: "Descripción del servicio 1" },
      { id: 2, title: "Servicio 2", description: "Descripción del servicio 2" },
      { id: 3, title: "Servicio 3", description: "Descripción del servicio 3" },
    ];
    setCards(serviceCards);

    // Animaciones
    setTimeout(() => setHarpVisible(true), 500);
    setTimeout(() => {
      setServicesVisible(true);
      // Mostrar las cards una a una después de "Tus Servicios"
      setTimeout(() => {
        serviceCards.forEach((card, index) => {
          setTimeout(() => {
            setVisibleCards((prev) => {
              if (!prev.find(c => c.id === card.id)) {
                return [...prev, card];
              }
              return prev;
            });
          }, index * 1000); // Retraso de 1 segundo entre cada tarjeta
        });
        // Mostrar tarjeta de agregar servicio después de las otras
        setTimeout(() => {
          setVisibleCards((prev) => {
            if (!prev.find(c => c.id === 'add')) {
              return [...prev,{ id: 'add', title: '+', description: 'Agregar' }];
            }
            return prev;
          });
        }, serviceCards.length * 1000); // Muestra el '+' al final
      }, 2000); // Retraso de 2 segundos para que aparezcan después de "Tus Servicios"
    }, 1500);
  }, []);

  const handleCardClick = (id) => {
    if (id === 'add') {
      navigate("/servicio/crear-servicio"); // Redirige a la página de creación de servicio
    } else {
      navigate(`/servicio/${id}`); // Redirige a la página del servicio
    }
  };

  return (
    <div style={{ backgroundColor: '#E6E6FA', height: "100vh", padding: '2rem', fontFamily: 'Roboto', width: '100vw' }}>
      <div style={{ textAlign: 'center', opacity: isHarpVisible ? 1 : 0, transition: 'opacity 0.5s ease-in-out', color: 'black', padding: '1rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Harp</h1>
      </div>
      {/* Agrupando el fondo y el texto "Tus Servicios" */}
      <div style={{ textAlign: 'center', opacity: isHarpVisible ? 1 : 0, transition: 'opacity 0.5s ease-in-out', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', position: 'relative' }}>
        {/* Contenedor para el color de fondo y el texto */}
        <div style={{ padding: '1rem', borderRadius: '8px', opacity: isServicesVisible ? 1 : 0, transition: 'opacity 0.5s ease-in-out', position: 'relative' }}>
          <h2 style={{ color: '#4F46E5', margin: 0 }}>Tus Servicios</h2>
        </div>
        
        {/* Cards de servicios */}
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: '1rem' }}>
          {visibleCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="custom-card" // Clase CSS para aplicar estilos personalizados
              style={{
                opacity: card.id === 'add' || visibleCards.length > 0 ? 1 : 0, // Mantener visibles las cards ya aparecidas
                width: '6vw', // Ancho reducido
                minHeight: '5vw', // Altura mínima ajustada
                margin: '1vw', // Margen entre tarjetas
              }}
            >
              <div className="icon-container">
                {/* Aquí puedes agregar el ícono si es necesario */}
              </div>
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
