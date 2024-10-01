import React from 'react';
import './LandingPage.css';

export default function CardInfo() {
  return (
    <div className="container landing-page">
      <div className='container'>
        <h1 className="row justify-content-left h1" >Gestiona tus servicios con Harp</h1>
      </div>

      <div className="row justify-content-center">
        <div className="col card-spacing"> {/* Cambiar a col */}
          <div className="card custom-card rounded">
            <div className="card-body">
              <h5 className="card-title" style={{color: "white"}}>Cobros Automatizados </h5>
              <p className="card-text">
                Tus alumnos podrán abonar las cuotas por la aplicación de manera que queden registrados automáticamente.
                Además, se les recordará en el monto y fechas límite de la cuota cada ciclo.
              </p>
              <a href="#" className="btn custom-btn">Ir a la acción</a>
            </div>
          </div>
        </div>
        <div className="col card-spacing"> {/* Cambiar a col */}
          <div className="card custom-card rounded">
            <div className="card-body">
              <h5 className="card-title" style={{color: "white"}}>Seguimiento de alumnos </h5>
              <p className="card-text">
                Podrás registrar las asistencias de los alumnos en cada clase.
                También anotaciones y avances claves.
              </p>
              <a href="#" className="btn custom-btn">Ir a la acción</a>
            </div>
          </div>
        </div>
        <div className="col card-spacing"> {/* Cambiar a col */}
          <div className="card custom-card rounded">
            <div className="card-body">
              <h5 className="card-title" style={{color: "white"}}>Publicidad del servicio</h5>
              <p className="card-text" >
                Se les dará a conocer a personas interesadas tu servicio toda la 
                información necesaria para que decidan inscribirse.
              </p>
              <a href="#" className="btn custom-btn">Ir a la acción</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
