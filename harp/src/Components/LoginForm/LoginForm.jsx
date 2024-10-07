import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import './LoginForm.css'; // Importa el archivo CSS
import PanaTeacher from '../../assets/PanaLogin.png'; // Asegúrate de importar tu imagen
// import { signInWithGoogle } from '../../services/authService'; // Asegúrate de implementar esta función

export const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedUser = window.localStorage.getItem("loggedUser");
        if (loggedUser) {
            setUser(JSON.parse(loggedUser));
        }
    }, []);

    const onSubmit = async (data) => {
        // Lógica de inicio de sesión
        console.log(data);
    };

    const handleGoogleLogin = async () => {
        try {
            const user = await signInWithGoogle();
            window.localStorage.setItem('loggedUser', JSON.stringify(user));
            setUser(user);
        } catch (error) {
            setErrorMessage('Error al iniciar sesión con Google: ' + error.message);
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        }
    };

    const loginForm = () => (
        <div className="container-fluid">
            <div className="row vh-100">
                {/* Sección de Imagen */}
                <div className="col-lg-6 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#A5B4FC' }}>
                    <img src={PanaTeacher} alt="Login Illustration" style={{ width: '80%', maxHeight: '90%', objectFit: 'contain' }} />
                </div>

                {/* Sección de Formulario */}
                <div className="col-lg-6 d-flex justify-content-center align-items-center">
                    <div className="col-md-8 col-sm-10">
                        <h1 className="text-center">Iniciar Sesión</h1>
                        <Link to="/registrarse" className="d-block text-center mb-3">
                            Si no tienes un usuario, regístrate aquí
                        </Link>

                        <div className="card shadow-sm mt-4">
                            <div className="card-header text-left">
                                <i className="bi bi-person"></i> Por favor, ingresa tus datos de inicio de sesión
                            </div>

                            <div className="card-body">
                                {errorMessage && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <form className="mt-3" onSubmit={handleSubmit(onSubmit)} id="login">
                                    <div className="form-group mb-3">
                                        <label htmlFor="email">Correo Electrónico</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            id="email" 
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                            placeholder="Correo Electrónico" 
                                            autoComplete="email" 
                                            {...register("email", { required: true })} 
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                Por favor, ingrese un correo electrónico
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <label htmlFor="password" className="mb-0">Contraseña</label>
                                            <Link to="/recuperar-contrasena" className="text-primary" style={{ textDecoration: 'underline' }}>
                                                ¿Te olvidaste tu contraseña?
                                            </Link>
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            placeholder="Contraseña"
                                            autoComplete="current-password"
                                            {...register("password", { required: true })}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback">
                                                Por favor, ingrese una contraseña
                                            </div>
                                        )}
                                    </div>

                                    {/* Checkbox para recordar datos */}
                                    <div className="form-check mb-3">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="rememberMe"
                                        />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Recordar mis datos
                                        </label>
                                    </div>

                                    <div className="d-flex justify-content-center">
                                        <button 
                                            type="submit" 
                                            className="btn fs-4" 
                                            style={{ 
                                                backgroundImage: "linear-gradient(135deg, #1E1B4B, #4F46E5)", 
                                                color: 'white',
                                                padding: '20px' 
                                            }}
                                        >
                                            Iniciar Sesión
                                        </button>
                                    </div>
                                </form>

                                <div className="text-center mt-4">
                                    <hr />
                                    <p>O, si deseas, inicia sesión con:</p>
                                    <button 
                                        onClick={handleGoogleLogin} 
                                        className="btn fs-4" 
                                        style={{ 
                                            backgroundColor: 'red',
                                            color: 'white',
                                            padding: '15px' 
                                        }}
                                    >
                                        <i className="bi bi-google"></i> Google 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const userDashboard = () => (
        <main className="container mt-3">
            <h2>Bienvenido, {user.userName}</h2>
            <hr />
        </main>
    );

    return (
        <>
            {user ? userDashboard() : loginForm()}
        </>
    );
};
