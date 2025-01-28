import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import PanaTeacher from '../../assets/panaBuenLogin.png';
import { iniciarSesion } from '../../services/Login';

export const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const { email, password } = data;
            const response = await iniciarSesion(email, password);

            const { id, perfil } = response;

            // Guardar la información del usuario en el localStorage
            window.localStorage.setItem('loggedUser', JSON.stringify(response));

            // Redirigir al usuario según su perfil
            if (perfil === 'instructor') {
                navigate(`/instructor/${id}/servicios`);
            } else if (perfil === 'alumno') {
                navigate(`/alumno/${id}/dashboard`);
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
                height: "90vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div className="row h-100">
                <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center bg-light" style={{ height: '100%', maxHeight: '90vh' }}>
                    <img
                        src={PanaTeacher}
                        alt="Login Illustration"
                        className="img-fluid"
                        style={{ 
                            maxHeight: '60%',
                            width: 'auto',
                            maxWidth: '400px',
                            objectFit: 'contain' 
                        }} 
                    />
                </div>

                <div className="col-lg-6 col-12 d-flex justify-content-center align-items-center" style={{ height: '100%', maxHeight: '90vh' }}>
                    <div
                        className="col-md-8 col-sm-10"
                        style={{
                            height: "auto", 
                            marginTop: "1em",
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
                                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                            placeholder="Correo Electrónico" 
                                            autoComplete="email" 
                                            {...register("email", { required: true })} 
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                Por favor, ingresa un correo electrónico
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
