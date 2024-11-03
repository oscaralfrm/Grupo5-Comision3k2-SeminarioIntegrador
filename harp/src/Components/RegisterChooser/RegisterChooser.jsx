import React from "react";
import { useNavigate } from "react-router-dom";
import panaTeacher from "../../assets/PanaTeacher.png"; 
import panaStudents from "../../assets/PanaStudents.png";

export const RegisterFormChooser = () => {
    const navigate = useNavigate();

    const handleInstructorClick = () => {
        navigate('/registrarse/instructor');
    };

    const handleStudentClick = () => {
        navigate('/registrarse/alumno');
    };

    return (
        <div className="container-fluid" style={{ width: '100vw', height: '100vh', padding: '0', overflow: 'hidden', fontFamily: 'Roboto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '10vh', marginBottom: '2vh', padding: '0 2vw', position: 'relative' }}>
                <i className="bi bi-arrow-left" onClick={() => window.history.back()} style={{ fontSize: '1.5em', color: 'black', cursor: 'pointer', position: 'absolute', left: '2vw' }}></i>
                <h2 className="text-center" style={{ fontSize: '3vw', margin: '0'}}>Elige tu tipo de registro</h2>
            </div>
            <div className="row" style={{ height: '90vh', margin: '0' }}>
                {/* Sección de Instructores */}
                <div className="col-md-6 col-12 d-flex flex-column align-items-center" 
                    style={{ 
                        backgroundColor: '#1E1B4B', 
                        color: '#fff', 
                        padding: '2vh', 
                        position: 'relative',
                        height: '100%' 
                    }}
                >
                    <h3 className="text-center" style={{ fontSize: '2.5vw' }}>¿Eres Instructor?</h3>
                    <img 
                        src={panaTeacher} 
                        alt="PanaTeacher" 
                        style={{ width: '60vw', height: '60vh', maxWidth: '30vw', objectFit: 'contain' }} 
                    />
                    <button
                        className="btn btn-light mt-3 mb-5"
                        onClick={handleInstructorClick}
                        style={{ 
                            position: 'absolute', 
                            bottom: '14vh', 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            backgroundImage: "linear-gradient(135deg, #1E1B4B, #4F46E5)", 
                            color: 'white', 
                            fontSize: '1.5vw', 
                            padding: '1vh 2vw', 
                            minWidth: '15vw' 
                        }} 
                    >
                        Registrarse como Instructor
                    </button>
                </div>

                {/* Sección de Alumnos */}
                <div className="col-md-6 col-12 d-flex flex-column align-items-center" 
                    style={{ 
                        backgroundColor: '#4F46E5', 
                        color: '#fff', 
                        padding: '2vh', 
                        position: 'relative',
                        height: '100%' 
                    }}
                >
                    <h3 className="text-center" style={{ fontSize: '2.5vw' }}>¿Eres Alumno?</h3>
                    <img 
                        src={panaStudents} 
                        alt="PanaStudents" 
                        style={{ width: '60vw', height: '60vh', maxWidth: '30vw', objectFit: 'contain' }} 
                    />
                    <button
                        className="btn btn-dark mt-3 mb-5"
                        onClick={handleStudentClick}
                        style={{ 
                            position: 'absolute', 
                            bottom: '14vh', 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            padding: '1vh 2vw', 
                            backgroundImage: "linear-gradient(135deg, #1E1B4B, #4F46E5)", 
                            color: 'white', 
                            fontSize: '1.5vw', 
                            minWidth: '15vw' 
                        }} 
                    >
                        Registrarse como Alumno
                    </button>
                </div>
            </div>
        </div>
    );
};
