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

    return (
        <div className="container-fluid vh-100 p-0">
            <div className="d-flex align-items-center justify-content-center vh-10 mb-2 position-relative">
                <i className="bi bi-arrow-left position-absolute" onClick={() => window.history.back()} style={{ fontSize: '1.5em', color: 'black', cursor: 'pointer', left: '2vw' }}></i>
                <h2 className="text-center" style={{ fontSize: '3vw', margin: '0' }}>Elige tu tipo de registro</h2>
            </div>
            <div className="row h-100 m-0">
                {/* Sección de Instructores */}
                <div className="col-md-6 col-12 d-flex flex-column align-items-center bg-dark text-white p-4">
                    <h3 className="text-center" style={{ fontSize: '2.5vw' }}>¿Eres Instructor?</h3>
                    <img 
                        src={panaTeacher} 
                        alt="PanaTeacher" 
                        className="img-fluid" 
                        style={{ width: '60vw', maxHeight: '60vh', objectFit: 'contain' }} 
                    />
                    <button
                        className="btn btn-light mt-3 mb-5"
                        onClick={handleInstructorClick}
                    >
                        Regístrate
                    </button>
                </div>

                {/* Sección de Alumnos */}
                <div className="col-md-6 col-12 d-flex flex-column align-items-center bg-primary text-white p-4">
                    <h3 className="text-center" style={{ fontSize: '2.5vw' }}>¿Eres Alumno?</h3>
                    <img 
                        src={panaStudents} 
                        alt="PanaStudents" 
                        className="img-fluid" 
                        style={{ width: '60vw', maxHeight: '60vh', objectFit: 'contain' }} 
                    />
                    <button
                        className="btn btn-dark mt-3 mb-5"
                        onClick={handleStudentClick}
                    >
                        Regístrate
                    </button>
                </div>
            </div>
        </div>
    );
};
