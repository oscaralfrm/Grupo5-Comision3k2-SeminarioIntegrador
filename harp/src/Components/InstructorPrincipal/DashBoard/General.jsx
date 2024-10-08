// General.js
import React, { useState, useEffect} from 'react';
const General = ({ service }) => {
  // Simulación de datos
  const [income, setIncome] = useState(100000);  // Plata ingresada
  const [pending, setPending] = useState(50000);  // Pagos pendientes
  const [expected, setExpected] = useState(0);  // Total esperado (Ingresos + Pendientes)

  // Calcula el total esperado cada vez que cambien los ingresos o los pendientes
  useEffect(() => {
    setExpected(income + pending);
  }, [income, pending]);

  return (
    <div className="position-fixed bottom-0 end-0 m-4">
      {/* Título */}
      <h5 className="text-center mb-3" style={{ color: '#240046' }}>Ingresos de Octubre</h5>
      
      <div className="d-flex justify-content-between">
        {/* Recuadro de Plata Ingresada */}
        <div className="card me-2" style={{ backgroundColor: '#5a189a', color: '#fff', width: '150px', height: '100px' }}>
          <div className="card-body text-center">
            <h6 className="card-title">Recibidos</h6>
            <p className="card-text fs-5">${income}</p>
          </div>
        </div>

        {/* Recuadro de Pendientes */}
        <div className="card me-2" style={{ backgroundColor: '#3c096c', color: '#fff', width: '150px', height: '100px' }}>
          <div className="card-body text-center">
            <h6 className="card-title">Pendientes</h6>
            <p className="card-text fs-5">${pending}</p>
          </div>
        </div>

        {/* Recuadro de Esperados */}
        <div className="card" style={{ backgroundColor: '#240046', color: '#fff', width: '150px', height: '100px' }}>
          <div className="card-body text-center">
            <h6 className="card-title">Esperados</h6>
            <p className="card-text fs-5">${expected}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;