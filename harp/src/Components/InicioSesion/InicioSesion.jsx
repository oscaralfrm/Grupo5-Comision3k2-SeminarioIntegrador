import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import PanaTeacher from '../../assets/panaBuenLogin.png';
import { iniciarSesion } from '../../services/Login';
import { getAllInstructores } from '../../services/Instructor';
import { getAllAlumnos } from '../../services/Alumno'; // Importar las funciones

export const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            console.log('Datos del formulario:', data); // Log de los datos del formulario

            const { email, password } = data;
            console.log('Email:', email, 'Contraseña:', password); // Log del email y contraseña

            const response = await iniciarSesion(email, password);
            console.log('Respuesta del backend:', response); // Log de la respuesta del backend

            const { id, perfil } = response;
            console.log('ID del usuario:', id, 'Perfil del usuario:', perfil); // Log del ID y perfil

            // Guardar la información del usuario en el localStorage
            window.localStorage.setItem('loggedUser', JSON.stringify(response));
            console.log('Usuario guardado en localStorage');

            // Buscar instructores o alumnos según el perfil
            if (perfil === 'instructor') {
                const instructores = await getAllInstructores(); // Obtener todos los instructores
                console.log('Instructores obtenidos:', instructores); // Log de todos los instructores
                
                // Buscar el instructor cuyo id coincide con el id del usuario
                console.log("Id: ", instructores[0].usuario.id)
                const instructor = instructores.find(instructor => instructor.usuario.id === id); // Comparar con el id del usuario
                if (instructor) {
                    console.log(instructor);
                    const userProfileId = instructor.id; // Usar el id del instructor directamente
                    console.log('ID del instructor encontrado:', userProfileId); // Log del idInstructor
                    navigate(`/instructor/${userProfileId}/servicios`);
                } else {
                    console.error('Instructor no encontrado');
                    setErrorMessage('No se encontró el instructor.');
                }
            } else if (perfil === 'alumno') {
                const alumnos = await getAllAlumnos(); // Obtener todos los alumnos
                console.log('Alumnos obtenidos:', alumnos); // Log de todos los alumnos
                
                // Buscar el alumno cuyo id coincide con el id del usuario
                const alumno = alumnos.find(alumno => alumno.usuario.id === id); // Comparar con el id del usuario
                if (alumno) {
                    const userProfileId = alumno.id; // Usar el id del alumno directamente
                    console.log('ID del alumno encontrado:', userProfileId); // Log del idAlumno
                    navigate(`/alumno/${userProfileId}/inscripciones`);
                } else {
                    console.error('Alumno no encontrado');
                    setErrorMessage('No se encontró el alumno.');
                }
            }

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setErrorMessage('Error al iniciar sesión. Por favor, verifica tus credenciales.');
            setTimeout(() => setErrorMessage(''), 5000); // Limpiar mensaje de error después de 5 segundos
        }
    };

    const loginForm = () => (
        <div
            className="container-fluid"
            style={{
                overflow: "hidden",
                padding: "0",
                margin: "0",
                height: "85vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div className="row h-100">
                <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center bg-light" style={{ height: '100%'}}>
                    <img
                        src={PanaTeacher}
                        alt="Login Illustration"
                        className="img-fluid"
                        style={{
                            maxHeight: '60%',
                            width: 'auto',
                            maxWidth: '400px',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                <div className="col-lg-6 col-12 d-flex justify-content-center align-items-center" style={{ height: '100%'}}>
                    <div
                        className="col-md-8 col-sm-10"
                        style={{
                            height: "auto",
                            // marginTop: "1em",
                            marginBottom: "0.5em",
                        }}
                    >
                        <h1 className="text-center">Iniciar Sesión</h1>
                        <Link to="/registro" className="d-block text-center mb-3">
                            Si no tienes un usuario, regístrate aquí
                        </Link>

                        <div className="card shadow-sm mt-4">
                            <div className="card-header">
                                <i className="bi bi-person"></i> Por favor, ingresa tus datos de inicio de sesión
                            </div>

                            <div className="card-body">
                                {errorMessage && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <form className="mt-3" onSubmit={handleSubmit(onSubmit)} id="login">
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Usuario o Correo</label>
                                        <input
                                            type="text"
                                            id="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            placeholder="Usuario o Correo"
                                            autoComplete="email"
                                            {...register("email", { required: true })}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                Por favor, ingresa un usuario o correo
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <label htmlFor="password" className="mb-0">Contraseña</label>
                                            <Link to="/recuperar-contrasena" className="text-primary text-decoration-underline">
                                                ¿Te olvidaste tu contraseña?
                                            </Link>
                                        </div>
                                        <input
                                            type="password"
                                            id="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            placeholder="Contraseña"
                                            autoComplete="current-password"
                                            {...register("password", { required: true })}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback">
                                                Por favor, ingresa una contraseña
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-center">
                                        <button
                                            type="submit"
                                            className="btn fs-5"
                                            style={{ backgroundImage: "linear-gradient(135deg, #1E1B4B, #4F46E5)", color: 'white', padding: '6px 17px' }}
                                        >
                                            Iniciar Sesión
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return loginForm();
};
