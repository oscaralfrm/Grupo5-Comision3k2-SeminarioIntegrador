import React from 'react';
import GenericCard from './GenericCard';
import { FaBullhorn, FaUserGraduate, FaMoneyBillWave } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

export default function CardInfo() {
    return (
        <div className="container mt-5 mb-4 text-center" style={{ fontFamily: 'Roboto' }}>
            <h1 className="fw-bold mb-4" style={{ fontFamily: 'Roboto', color: '#1E1B4B' }}>
                <TypeAnimation
                    sequence={['Gestiona tus servicios con Harp', 1000]}
                    speed={40}
                    wrapper="span"
                    repeat={Infinity}
                />
            </h1>
            <div className="row justify-content-center gap-3 mb-5 mt-4">
                <div className="col-12 col-md-3 d-flex mb-5 card-container">
                    <GenericCard
                        title="Publicidad del servicio"
                        description="Se proporcionará a las personas interesadas toda la información necesaria sobre su servicio."
                        icon={<FaBullhorn size={80} />}
                    />
                </div>
                <div className="col-12 col-md-3 d-flex mb-5 card-container">
                    <GenericCard
                        title="Seguimiento de alumnos"
                        description="Podrás registrar las asistencias de los alumnos en cada clase. También anotaciones y avances claves."
                        icon={<FaUserGraduate size={80} />}
                    />
                </div>
                <div className="col-12 col-md-3 d-flex mb-5 card-container">
                    <GenericCard
                        title="Cobros Automatizados"
                        description="Tus alumnos podrán abonar las cuotas por la aplicación para que se registren automáticamente."
                        icon={<FaMoneyBillWave size={80} />}
                    />
                </div>
            </div>
            <style jsx>{`
                .card-container {
                    transition: transform 0.6s;
                    transform-style: preserve-3d;
                    perspective: 1000px;
                }

                .card-container:hover {
                    animation: flip 1s forwards;
                }

                @keyframes flip {
                    0%, 100% {
                        transform: rotateY(0deg);
                    }
                    50% {
                        transform: rotateY(180deg);
                    }
                }

                @media (max-width: 768px) {
                    .card-container {
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
}
