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
        <div className="container-fluid vh-100 p-0" style={{fontFamily:'Roboto'}}>
            <div className="row h-100 m-0">
                {/* Sección de Instructores */}
                <div className="col-md-6 col-12 d-flex flex-column align-items-center  text-white p-4" style={{backgroundImage: 'linear-gradient(to right, #4F46E5, #A5B4FC)'}}>
                    <h3 className="text-center" style={{ fontSize: '2.5vw' }}>¿Eres Instructor?</h3>
                    <img 
                        src={panaTeacher} 
                        alt="PanaTeacher" 
                        className="img-fluid" 
                        style={{ width: '60vw', maxHeight: '60vh', objectFit: 'contain' }} 
                    />
                    <button
                        className="btn  mt-3 mb-5"
                        style={{backgroundColor:'#A5B4FC'}}
                        onClick={handleInstructorClick}
                    >
                        Regístrate
                    </button>
                </div>

                {/* Sección de Alumnos */}
                <div className="col-md-6 col-12 d-flex flex-column align-items-center  text-white p-4" style={{backgroundImage:  'linear-gradient(to right, #A5B4FC, #4F46E5)'}}>
                    <h3 className="text-center" style={{ fontSize: '2.5vw' }}>¿Eres Alumno?</h3>
                    <img 
                        src={panaStudents} 
                        alt="PanaStudents" 
                        className="img-fluid" 
                        style={{ width: '60vw', maxHeight: '60vh', objectFit: 'contain'}} 
                    />
                    <button
                        className="btn  mt-3 mb-5"
                        style={{backgroundColor:'#4F46E5'}}
                        onClick={handleStudentClick}
                    >
                        Regístrate
                    </button>
                </div>
            </div>
        </div>
    );
};