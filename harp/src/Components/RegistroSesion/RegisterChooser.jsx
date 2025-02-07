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

    const slideInLeftStyle = {
        animation: 'slide-in-left 1s ease-out forwards'
    };

    const slideInRightStyle = {
        animation: 'slide-in-right 1s ease-out forwards'
    };

    const cardStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
        borderRadius: '20px',
        padding: '1.5rem',
        minHeight: '400px',
        width: '100%',
    };

    return (
        <div 
            className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-start" 
            style={{
                fontFamily: 'Roboto',
                backgroundColor: '#FFFFFF',
                padding: '5rem 1rem 0', // Incrementado el margen superior
                margin: '0 0 0.5rem 0',  // Reducido el margen inferior
                overflow: 'hidden',
            }}
        >
            <div className="row w-100 d-flex justify-content-center" style={{ gap: '55px', flexWrap: 'wrap' }}>
                <div className="col-lg-5 col-md-5 col-sm-8 col-10 d-flex justify-content-center px-0">
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
                            className="btn btn-lg btn-light text-dark mt-3"
                            style={{ borderRadius: '30px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                            onClick={handleInstructorClick}
                        >
                            Regístrate
                        </button>
                    </div>
                </div>

                <div className="col-lg-5 col-md-5 col-sm-8 col-10 d-flex justify-content-center px-0">
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
                            className="btn btn-lg btn-light text-dark mt-3" 
                            style={{ borderRadius: '30px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                            onClick={handleStudentClick}
                        >
                            Regístrate
                        </button>
                    </div>
                </div>
            </div>

            <style>
                {`
                    body {
                        margin: 0;
                        overflow: hidden;
                    }
                    @media (max-width: 576px) {
                        .container-fluid {
                            padding: 2rem 1rem 0;
                        }
                        h3 {
                            font-size: 1.6rem;
                        }
                    }
                    @media (min-width: 577px) and (max-width: 768px) {
                        .container-fluid {
                            padding: 2.5rem 1.5rem 0;
                        }
                        h3 {
                            font-size: 1.8rem;
                        }
                    }
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
                `}
            </style>
        </div>
    );
};
