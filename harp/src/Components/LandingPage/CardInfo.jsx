import React from 'react';
import './LandingPage.css';
import GenericCard from './GenericCard';
import { TypeAnimation } from 'react-type-animation';
import { FaMoneyBillWave, FaUserGraduate, FaBullhorn } from 'react-icons/fa';

export default function CardInfo() {
  return (
    <div style={{ marginTop: '11vw', marginBottom: '1rem' }}>
      <div className="row mb-4">
        <h1 className="col-12 h1 text-left">
          <TypeAnimation
            sequence={['Gestiona tus servicios con Harp', 1000]}
            speed={40}
            wrapper="span"
            repeat={Infinity}
          />
        </h1>
      </div>

      <div className="row justify-content-center" style={{ marginLeft: '1vw' }}>
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
          <GenericCard
            title="Cobros Automatizados"
            description="Tus alumnos podrán abonar las cuotas por la aplicación de manera que queden registrados automáticamente."
            route="#"
            icon={<FaMoneyBillWave />} // Icono representativo
            color="#4F46E5" // Color de fondo
          />
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
          <GenericCard
            title="Seguimiento de alumnos"
            description="Podrás registrar las asistencias de los alumnos en cada clase. También anotaciones y avances claves."
            route="#"
            icon={<FaUserGraduate />}
            // style = {{backgroundColor: 'linear-gradient(135deg, #1E1B4B, #4F46E5)'}}
            color= "#4F46E5"
          />
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
          <GenericCard
            title="Publicidad del servicio"
            description="Se les dará a conocer a personas interesadas tu servicio toda la información necesaria para que decidan inscribirse."
            route="#"
            icon={<FaBullhorn />}
            color="#4F46E5"
          />
        </div>
      </div>
    </div>
  );
}

