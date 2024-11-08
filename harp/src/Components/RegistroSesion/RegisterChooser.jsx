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
        height: '100%', // Se asegura de que ambas tarjetas tengan la misma altura
        borderRadius: '20px',
        padding: '1.5rem', // Reducir padding para menos espacio dentro de las tarjetas
        minHeight: '400px', // Para asegurar un tamaño adecuado en pantallas pequeñas
    };

    return (
        <div 
            className="container-fluid vh-100 d-flex align-items-center justify-content-center" 
            style={{
                fontFamily: 'Roboto',
                backgroundColor: '#F4F4F9',
                padding: '2rem',
                marginTop: '-3em', // Sin margen en pantallas grandes
            }}
        >
            <div className="row w-100 d-flex justify-content-between" style={{ gap: '0' }}>
                {/* Card de Instructor */}
                <div className="col-md-5 col-sm-8 col-12 d-flex justify-content-center mb-3 px-0 a" style={{ marginRight: '20px' }}>
                    <div 
                        className="shadow-lg w-100"
                        style={{
                            ...cardStyle,
                            backgroundImage: 'linear-gradient(to right, #4F46E5, #A5B4FC)',
                            ...slideInLeftStyle,
                        }}
                    >
                        <h3 className="mb-3" style={{ fontSize: '2rem' }}>¿Eres Instructor?</h3>
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
                <div className="col-md-5 col-sm-8 col-12 d-flex justify-content-center mb-3 px-0 b" style={{ marginLeft: '20px' }}>
                    <div 
                        className="shadow-lg w-100"
                        style={{
                            ...cardStyle,
                            backgroundImage: 'linear-gradient(to right, #A5B4FC, #4F46E5)',
                            ...slideInRightStyle,
                        }}
                    >
                        <h3 className="mb-3" style={{ fontSize: '2rem' }}>¿Eres Alumno?</h3>
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
            
            {/* Media query para ajustar el margen superior en pantallas pequeñas */}
            <style>
                {`
                    @media (max-width: 768px) {
                        .container-fluid {
                            margin-top: 6vh !important;
                        }
                        .col-md-5 {
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                        }
                    }
                    @media (min-width: 768px) {
                        .b {
                            margin-left: 0px; /* Márgenes para pantallas más grandes */
                            margin-right: 60px; /* Márgenes para pantallas más grandes */
                        }
                        .a {
                            margin-left: 60px; /* Márgenes para pantallas más grandes */
                            margin-right: 0px; /* Márgenes para pantallas más grandes */
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
