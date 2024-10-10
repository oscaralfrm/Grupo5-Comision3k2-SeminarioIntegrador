// Pagos.js
import React from 'react';

const Pagos = () => {
  // Simulación de pagos (esto debería venir de un backend)
  const pagos = [
    { id: 1, curso: 'Yoga Adultos', fecha: '2024-10-01', monto: '$30' },
    { id: 2, curso: 'Entrenamiento Funcional', fecha: '2024-10-08', monto: '$40' },
  ];

  return (
    <div className="container mt-4">
      <h2>Pagos</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Fecha</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map(pago => (
            <tr key={pago.id}>
              <td>{pago.curso}</td>
              <td>{pago.fecha}</td>
              <td>{pago.monto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pagos;
