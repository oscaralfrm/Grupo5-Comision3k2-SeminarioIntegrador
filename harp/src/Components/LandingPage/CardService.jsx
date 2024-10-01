import React from 'react';
import './LandingPage.css';

function CardService() {
  return (
    <div className="card custom-card rounded">
      <img src="https://via.placeholder.com/150" className="card-img-top" alt="Imagen de ejemplo" />
      <div className="card-body">
        <h5 className="card-title">Título de la Tarjeta</h5>
        <p className="card-text">
          Esta es una breve descripción de lo que ofrece esta tarjeta. Puede contener información relevante sobre el contenido.
        </p>
        <a href="#" className="btn custom-btn">Ir a la acción</a>
      </div>
    </div>
  );
}

export default CardService;
