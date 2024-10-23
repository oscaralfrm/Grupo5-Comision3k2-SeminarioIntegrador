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
      <h2 className="text-center">Reseñas</h2>
      <div className="row mt-4">
        {reseñas.length > 0 ? (
          reseñas.map((reseña) => (
            <div className="col-md-4 mb-4" key={reseña.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{reseña.curso}</h5>
                  <p className="card-text">{reseña.comentario}</p>
                  <small>Calificación: {reseña.calificacion} estrellas</small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <div className="alert alert-warning" role="alert">
              No hay reseñas registradas.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reseñas;