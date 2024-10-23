// Asistencias.js
import React from 'react';

const Asistencias = () => {
  // Simulación de asistencias (esto debería venir de un backend)
  const asistencias = [
    { fecha: '2024-10-01', curso: 'Yoga Adultos', asistido: true },
    { fecha: '2024-10-08', curso: 'Entrenamiento Funcional', asistido: false },
    { fecha: '2024-10-15', curso: 'Yoga Jóvenes', asistido: true },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center">Asistencias</h2>
      <div className="row mt-4">
        {asistencias.map((asistencia, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{asistencia.curso}</h5>
                <p className="card-text">
                  <strong>Fecha:</strong> {asistencia.fecha}
                </p>
                <p className="card-text">
                  <strong>Asistido:</strong> {asistencia.asistido ? 'Sí' : 'No'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Asistencias;
