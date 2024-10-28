import React, { useState, useEffect } from 'react'; 

const General = () => {
  const [income, setIncome] = useState(100000);
  const [pending, setPending] = useState(50000);
  const [expected, setExpected] = useState(0);

  useEffect(() => {
    setExpected(income + pending);
  }, [income, pending]);

  return (
      <div
        className="flex-grow-1"
        style={{
          padding: '1vw',
          width: '100%', // El ancho siempre será el 100%, sin importar el sidebar
          position: 'relative', // Asegura que el contenido no cambie
        }}
      >
        <div className="d-flex justify-content-center align-items-center min-vh-100 flex-wrap">
          <div className="text-center">
            {/* Título */}
            <h5 className="text-center mb-3" style={{ color: '#240046' }}>Ingresos de Octubre</h5>

            <div className="d-flex justify-content-center flex-wrap" style={{ gap: '1vw' }}>
              {/* Recuadro de Plata Ingresada */}
              <div className="card" style={{ backgroundColor: '#5a189a', color: '#fff', width: '12vw', height: '9vw' }}>
                <div className="card-body text-center">
                  <h6 className="card-title">Recibidos</h6>
                  <p className="card-text fs-5">${income}</p>
                </div>
              </div>

              {/* Recuadro de Pendientes */}
              <div className="card" style={{ backgroundColor: '#3c096c', color: '#fff', width: '12vw', height: '9vw' }}>
                <div className="card-body text-center">
                  <h6 className="card-title">Pendientes</h6>
                  <p className="card-text fs-5">${pending}</p>
                </div>
              </div>

              {/* Recuadro de Esperados */}
              <div className="card" style={{ backgroundColor: '#240046', color: '#fff', width: '12vw', height: '9vw' }}>
                <div className="card-body text-center">
                  <h6 className="card-title">Esperados</h6>
                  <p className="card-text fs-5">${expected}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default General;
