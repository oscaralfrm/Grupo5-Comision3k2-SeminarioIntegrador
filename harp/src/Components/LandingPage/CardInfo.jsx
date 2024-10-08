import React from 'react';
import './LandingPage.css';
import GenericCard from './GenericCard';

export default function CardInfo() {
  return (
    <div className="container landing-page">
      <div className='container'>
        <h1 className="row justify-content-left h1">Gestiona tus servicios con Harp</h1>
      </div>
      
      <div className="row justify-content-center"> {/* Fila para las tarjetas */}
        <GenericCard
          title="Cobros Automatizados"
          description="Tus alumnos podrán abonar las cuotas por la aplicación de manera que queden registrados automáticamente. Además, se les recordará en el monto y fechas límite de la cuota cada ciclo."
          route="#"
        />
        <GenericCard
          title="Seguimiento de alumnos"
          description="Podrás registrar las asistencias de los alumnos en cada clase. También anotaciones y avances claves."
          route="#"
        />
        <GenericCard
          title="Publicidad del servicio"
          description="Se les dará a conocer a personas interesadas tu servicio toda la información necesaria para que decidan inscribirse."
          route="#"
        />
      </div>
    </div>
  );
}

