// Reseñas.js
import React from 'react';

const Reseñas = () => {
  // Simulación de reseñas (esto debería venir de un backend)
  const reseñas = [
    { id: 1, curso: 'Yoga Adultos', comentario: 'Excelente curso, lo disfruté mucho.', calificacion: 5 },
    { id: 2, curso: 'Entrenamiento Funcional', comentario: 'Muy desafiante, pero me encantó.', calificacion: 4 },
    { id: 3, curso: 'Yoga Jóvenes', comentario: 'Los instructores son geniales.', calificacion: 5 },
  ];

  return (
    <div className="container mt-4">
      <h2>Reseñas</h2>
      <div className="list-group">
        {reseñas.map(reseña => (
          <div className="list-group-item" key={reseña.id}>
            <h5>{reseña.curso}</h5>
            <p>{reseña.comentario}</p>
            <small>Calificación: {reseña.calificacion} estrellas</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reseñas;
