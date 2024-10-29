import React from 'react';
import GenericCard from './GenericCard';
import { TypeAnimation } from 'react-type-animation';
import { FaMoneyBillWave, FaUserGraduate, FaBullhorn } from 'react-icons/fa';

export default function CardInfo() {
  return (
    <div style={{ marginTop: '11vw', marginBottom: '1rem', width: '100%', overflowX: 'hidden' }}>
      <div className="row mb-4">
        <h1 className='text-center'
          style={{
            color: '#1E1B4B',
            textAlign: 'left',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '3rem',
            fontWeight: 'bold',
          }}
        >
          <TypeAnimation
            sequence={['Gestiona tus servicios con Harp', 1000]}
            speed={40}
            wrapper="span"
            repeat={Infinity}
          />
        </h1>
      </div>

      <div className="row justify-content-center" style={{ marginLeft: '1vw', display: 'flex' }}>
        <div className="col-md-3 col-sm-12 mb-4" style={{ padding: '0 1vw' }}>
          <GenericCard
            title="Cobros Automatizados"
            description="Tus alumnos podrán abonar las cuotas por la aplicación de manera que queden registrados automáticamente."
            route="#"
            icon={<FaMoneyBillWave style={{ fontSize: '50px' }} />}
            color="#4F46E5"
          />
        </div>
        <div className="col-md-3 col-sm-12 mb-4" style={{ padding: '0 1vw' }}>
          <GenericCard
            title="Seguimiento de alumnos"
            description="Podrás registrar las asistencias de los alumnos en cada clase. También anotaciones y avances claves."
            route="#"
            icon={<FaUserGraduate style={{ fontSize: '50px' }} />}
            color="#4F46E5"
          />
        </div>
        <div className="col-md-4 col-sm-12 mb-4" style={{ padding: '0 1vw' }}>
          <GenericCard
            title="Publicidad del servicio"
            description="Se les dará a conocer a personas interesadas tu servicio toda la información necesaria para que decidan inscribirse."
            route="#"
            icon={<FaBullhorn style={{ fontSize: '50px' }} />}
            color="#4F46E5"
          />
        </div>
      </div>
    </div>
  );
}
