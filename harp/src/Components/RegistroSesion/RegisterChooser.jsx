import React from "react";
import { useNavigate } from "react-router-dom";
import panaTeacher from "../../assets/PanaTeacher.png"; 
import panaStudents from "../../assets/PanaStudents.png";

export const RegisterFormChooser = () => {
    const navigate = useNavigate();

    const handleInstructorClick = () => {
        navigate('/registro/instructor');
    };

    const handleStudentClick = () => {
        navigate('/registro/alumno');
    };

    // Estilos de animación en línea
    const slideInLeftStyle = {
        animation: 'slide-in-left 1s ease-out forwards'
    };

    const slideInRightStyle = {
        animation: 'slide-in-right 1s ease-out forwards'
    };

    // Estilo de tarjetas para que tengan la misma altura y sean responsivas
    const cardStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
        borderRadius: '20px',
        padding: '1.5rem',
        minHeight: '350px', // Reducido para permitir más flexibilidad en pantallas pequeñas
        width: '100%', // Se asegura que las tarjetas no se extiendan más allá de su contenedor
    };

    return (
        <div 
            className="container-fluid vh-100 d-flex flex-column align-items-center" 
            style={{
                fontFamily: 'Roboto',
                backgroundColor: '#F4F4F9',
                padding: '1rem',
                marginTop: '10vh', // Mayor margen superior para bajar las tarjetas
            }}
        >
            <div className="row w-100 d-flex justify-content-center" style={{ gap: '80px', flexWrap: 'wrap' }}>
                {/* Card de Instructor */}
                <div className="col-lg-5 col-md-5 col-sm-8 col-10 d-flex justify-content-center mb-3 px-0">
                    <div 
                        className="shadow-lg w-100"
                        style={{
                            ...cardStyle,
                            backgroundImage: 'linear-gradient(to right, #4F46E5, #A5B4FC)',
                            ...slideInLeftStyle,
                        }}
                    >
                        <h3 className="mb-3" style={{ fontSize: '1.8rem' }}>¿Eres Instructor?</h3>
                        <img 
                            src={panaTeacher} 
                            alt="PanaTeacher" 
                            className="img-fluid mb-3" 
                            style={{ width: '100%', maxHeight: '30vh', objectFit: 'contain' }} 
                        />
                        <button
                            className="btn btn-lg btn-light text-dark mt-3 mb-3"
                            style={{ borderRadius: '30px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                            onClick={handleInstructorClick}
                        >
                            Regístrate
                        </button>
                    </div>
                </div>

                {/* Card de Alumno */}
                <div className="col-lg-5 col-md-5 col-sm-8 col-10 d-flex justify-content-center mb-3 px-0">
                    <div 
                        className="shadow-lg w-100"
                        style={{
                            ...cardStyle,
                            backgroundImage: 'linear-gradient(to right, #A5B4FC, #4F46E5)',
                            ...slideInRightStyle,
                        }}
                    >
                        <h3 className="mb-3" style={{ fontSize: '1.8rem' }}>¿Eres Alumno?</h3>
                        <img 
                            src={panaStudents} 
                            alt="PanaStudents" 
                            className="img-fluid mb-3" 
                            style={{ width: '100%', maxHeight: '30vh', objectFit: 'contain' }} 
                        />
                        <button
                            className="btn btn-lg btn-light text-dark mb-3" 
                            style={{ borderRadius: '30px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginTop: '3vh' }}
                            onClick={handleStudentClick}
                        >
                            Regístrate
                        </button>
                    </div>
                </div>
            </div>

            {/* Media queries más detallados */}
            <style>
                {`
                    @media (max-width: 576px) {
                        .container-fluid {
                            padding: 1rem;
                            margin-top: 15vh; // Aumentar el margen superior
                        }
                        h3 {
                            font-size: 1.6rem; // Ajustar el tamaño del texto
                        }
                    }
                    @media (min-width: 577px) and (max-width: 768px) {
                        .container-fluid {
                            padding: 1.5rem;
                            margin-top: 10vh; // Espacio ajustado para pantallas medianas
                        }
                        h3 {
                            font-size: 1.8rem; // Ajustar el tamaño del texto
                        }
                    }
                    @media (min-width: 769px) and (max-width: 992px) {
                        .container-fluid {
                            padding: 2rem;
                            margin-top: 0; // Elimina margen superior en escritorios grandes
                        }
                    }
                    @media (min-width: 993px) {
                        .container-fluid {
                            padding: 2rem;
                            margin-top: 0; // Elimina margen superior en escritorios grandes
                        }
                    }
                `}
            </style>
        </div>
    );
};

// Agregar las animaciones CSS al archivo
const styleTag = document.createElement('style');
styleTag.innerHTML = `
@keyframes slide-in-left {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slide-in-right {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;
document.head.appendChild(styleTag);