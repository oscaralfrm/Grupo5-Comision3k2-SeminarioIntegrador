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
      <h2>Asistencias</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Curso</th>
            <th>Asistido</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((asistencia, index) => (
            <tr key={index}>
              <td>{asistencia.fecha}</td>
              <td>{asistencia.curso}</td>
              <td>{asistencia.asistido ? 'Sí' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Asistencias;
