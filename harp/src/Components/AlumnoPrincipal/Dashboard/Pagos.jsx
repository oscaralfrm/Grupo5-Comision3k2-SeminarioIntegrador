import React from 'react';

const Pagos = () => {
  // Simulación de pagos (esto debería venir de un backend)
  const pagos = [
    { id: 1, curso: 'Yoga Adultos', fecha: '2024-10-01', monto: '$30' },
    { id: 2, curso: 'Entrenamiento Funcional', fecha: '2024-10-08', monto: '$40' },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center">Pagos</h2>
      <div className="row mt-4">
        {pagos.length > 0 ? (
          pagos.map((pago) => (
            <div className="col-md-6 mb-4" key={pago.id}>
              <div 
                className="card h-100" 
              >
                <div className="card-body">
                  <h5 className="card-title">{pago.curso}</h5>
                  <p className="card-text"><strong>Fecha de Pago:</strong> {pago.fecha}</p>
                  <p className="card-text"><strong>Monto:</strong> {pago.monto}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <div className="alert alert-warning" role="alert">
              No hay pagos registrados.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagos;
