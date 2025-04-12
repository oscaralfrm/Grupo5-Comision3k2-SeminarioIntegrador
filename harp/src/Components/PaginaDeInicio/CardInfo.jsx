import React, { useState, useEffect } from 'react';
import GenericCard from './GenericCard';
import { FaBullhorn, FaUserGraduate, FaMoneyBillWave } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

export default function CardInfo() {
    const [showCards, setShowCards] = useState([false, false, false]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCards([true, false, false]);
            setTimeout(() => setShowCards([true, true, false]), 300);
            setTimeout(() => setShowCards([true, true, true]), 600);
        }, 2000); // Se activa después de la animación del título

        return () => clearTimeout(timer);
    }, []);

    const handleCardClick = (url) => {
        window.location.href = url;
    };

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
                {[
                    { title: 'Publicidad del servicio', description: 'Se proporcionará a las personas interesadas toda la información necesaria sobre su servicio.', icon: <FaBullhorn size={80} /> },
                    { title: 'Seguimiento de alumnos', description: 'Podrás registrar las asistencias de los alumnos en cada clase. También anotaciones y avances claves.', icon: <FaUserGraduate size={80} /> },
                    { title: 'Cobros Automatizados', description: 'Tus alumnos podrán abonar las cuotas por la aplicación para que se registren automáticamente.', icon: <FaMoneyBillWave size={80} /> }
                ].map((card, index) => (
                    <div
                        key={index}
                        className="col-12 col-md-3 d-flex mb-5 card-container"
                        onClick={() => handleCardClick('/login')}
                        style={{
                            opacity: showCards[index] ? 1 : 0,
                            transform: showCards[index] ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out'
                        }}
                    >
                        <GenericCard title={card.title} description={card.description} icon={card.icon} />
                    </div>
                ))}
            </div>

            <style jsx>{`
                .card-container {
                    transition: transform 0.3s ease-in-out, opacity 0.5s ease-in-out;
                    cursor: pointer;
                }

                .card-container:hover {
                    transform: scale(1.1);
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
