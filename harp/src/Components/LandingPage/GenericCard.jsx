import React from 'react';
import './GenericCard.css'; // Asegúrate de tener estilos para la tarjeta

export default function GenericCard({ title, description, route, icon, color }) {
  return (
    <div className="generic-card" style={{ backgroundColor: color }}>
      <div className="icon-container">
        {icon}
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <a href={route} className="btn btn-primary">Más Información</a>
    </div>
  );
}

