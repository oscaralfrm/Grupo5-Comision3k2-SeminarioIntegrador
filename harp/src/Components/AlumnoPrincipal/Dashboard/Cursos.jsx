// Cursos.js
import React from 'react';

const Cursos = () => {
  // Simulación de cursos (esto debería venir de un backend)
  const cursos = [
    { id: 1, nombre: 'Yoga Adultos', descripcion: 'Clases de yoga para adultos.' },
    { id: 2, nombre: 'Entrenamiento Funcional', descripcion: 'Entrenamiento para mejorar la funcionalidad.' },
    { id: 3, nombre: 'Yoga Jóvenes', descripcion: 'Clases de yoga para jóvenes.' },
  ];

  return (
    <div className="container mt-4">
      <h2>Cursos</h2>
      <div className="row">
        {cursos.map(curso => (
          <div className="col-md-4" key={curso.id}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{curso.nombre}</h5>
                <p className="card-text">{curso.descripcion}</p>
                <button className="btn btn-primary">Ver Detalles</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cursos;
