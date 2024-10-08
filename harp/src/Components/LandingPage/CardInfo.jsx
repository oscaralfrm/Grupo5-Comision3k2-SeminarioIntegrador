import React from 'react';
import './LandingPage.css';
import GenericCard from './GenericCard';

export default function CardInfo() {
  return (
    <div className="container landing-page" style={{ marginTop: "-2em" }}> {/* Corregido */}
      <div className="row mb-4">
        <h1 className="col-12 h1 text-left">Gestiona tus servicios con Harp</h1>
      </div>
      
      <div className="row justify-content-center"> {/* Fila para las tarjetas */}
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4"> {/* Columna para la tarjeta 1 */}
          <GenericCard
            title="Cobros Automatizados"
            description="Tus alumnos podrán abonar las cuotas por la aplicación de manera que queden registrados automáticamente. Además, se les recordará en el monto y fechas límite de la cuota cada ciclo."
            route="#"
          />
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4"> {/* Columna para la tarjeta 2 */}
          <GenericCard
            title="Seguimiento de alumnos"
            description="Podrás registrar las asistencias de los alumnos en cada clase. También anotaciones y avances claves."
            route="#"
          />
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4"> {/* Columna para la tarjeta 3 */}
          <GenericCard
            title="Publicidad del servicio"
            description="Se les dará a conocer a personas interesadas tu servicio toda la información necesaria para que decidan inscribirse."
            route="#"
          />
        </div>
      </div>
    </div>
  );
}
