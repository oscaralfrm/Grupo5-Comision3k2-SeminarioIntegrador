import React from 'react';
import GenericCard from './GenericCard';
import { FaBullhorn, FaUserGraduate, FaMoneyBillWave } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

export default function CardInfo() {
    return (
        <div className="container mt-5 mb-4 text-center">
            <h1 className="fw-bold text-primary mb-4">
                <TypeAnimation
                    sequence={['Gestiona tus servicios con Harp', 1000]}
                    speed={40}
                    wrapper="span"
                    repeat={Infinity}
                />
            </h1>
            <div className="row justify-content-center gap-3 mb-5 mt-4">
                <div className="col-md-3 d-flex mb-5"> {/* Asegurando que todas las tarjetas tengan el mismo tamaño */}
                    <GenericCard
                        title="Publicidad del servicio"
                        description="Se les dará a conocer a personas interesadas tu servicio toda la información necesaria para que decidan inscribirse."
                        icon={<FaBullhorn size={50} />}
                    />
                </div>
                <div className="col-md-3 d-flex mb-5">
                    <GenericCard
                        title="Seguimiento de alumnos"
                        description="Podrás registrar las asistencias de los alumnos en cada clase. También anotaciones y avances claves."
                        icon={<FaUserGraduate size={50} />}
                    />
                </div>
                <div className="col-md-3 d-flex mb-5">
                    <GenericCard
                        title="Cobros Automatizados"
                        description="Tus alumnos podrán abonar las cuotas por la aplicación de manera que queden registrados automáticamente."
                        icon={<FaMoneyBillWave size={50} />}
                    />
                </div>
            </div>
        </div>
    );
}
