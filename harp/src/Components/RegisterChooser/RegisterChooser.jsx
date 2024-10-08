import { React } from "react";
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
        <>
            <div className="container-fluid">
                <h2 className="text-center m-5" style={{ fontSize: '3em' }}>Elige tu tipo de registro</h2>
                <div className="row" style={{ height: '100vh' }}>
                    {/* Sección de Instructores */}
                    <div className="col-md-6 col-12 d-flex flex-column align-items-center" style={{ backgroundColor: '#1E1B4B', color: '#fff', padding: '20px', position: 'relative' }}>
                        <h3 className="text-center fs-1">¿Eres Instructor?</h3>
                        {/* Imagen de instructores con estilos adaptativos */}
                        <img 
                            src={panaTeacher} 
                            alt="PanaTeacher" 
                            style={{ width: '80%', height: '80%', maxWidth: '600px', objectFit: 'contain' }} 
                        />
                        {/* Botón visible */}
                        <button
                            className="btn btn-light mt-3 mb-5"
                            onClick={handleInstructorClick}
                            style={{ 
                                position: 'absolute', 
                                bottom: '20px', 
                                left: '50%', 
                                transform: 'translateX(-50%)', 
                                backgroundImage: "linear-gradient(135deg, #1E1B4B, #4F46E5)", 
                                color: 'white', 
                                fontSize: '2em', 
                                padding: '0.5em 1em', // Responsive padding
                                minWidth: '200px' // Minimum width for consistency
                            }} 
                        >
                            Registrarse como Instructor
                        </button>
                    </div>

                    {/* Sección de Alumnos */}
                    <div className="col-md-6 col-12 d-flex flex-column align-items-center" style={{ backgroundColor: '#4F46E5', color: '#fff', padding: '20px', position: 'relative' }}>
                        <h3 className="text-center fs-1">¿Eres Alumno?</h3>
                        {/* Imagen de alumnos con estilos adaptativos */}
                        <img 
                            src={panaStudents} 
                            alt="PanaStudents" 
                            style={{ width: '80%', height: '80%', maxWidth: '600px', objectFit: 'contain' }} 
                        />
                        {/* Botón visible */}
                        <button
                            className="btn btn-dark mt-3 mb-5"
                            onClick={handleStudentClick}
                            style={{ 
                                position: 'absolute', 
                                bottom: '20px', 
                                left: '50%', 
                                transform: 'translateX(-50%)', 
                                padding: '0.5em 1em', // Responsive padding
                                backgroundImage: "linear-gradient(135deg, #1E1B4B, #4F46E5)", 
                                color: 'white', 
                                fontSize: '2em', 
                                minWidth: '200px' // Minimum width for consistency
                            }} 
                        >
                            Registrarse como Alumno
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
