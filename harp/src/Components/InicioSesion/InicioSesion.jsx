import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import PanaTeacher from '../../assets/PanaLogin.png'; // Asegúrate de importar tu imagen
import { getServiciosDeInstructor, iniciarSesion } from '../../services/Instructor';
// import { signInWithGoogle } from '../../services/authService'; // Asegúrate de implementar esta función

export const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(null);
    const navegate = useNavigate();
    useEffect(() => {
        const loggedUser = window.localStorage.getItem("loggedUser");
        if (loggedUser) {
            setUser(JSON.parse(loggedUser));
        }
    }, []);

    const onSubmit = async (data) => {
        try {
            const { email, password } = data;
            const id = await iniciarSesion(email, password);
            const servicios = await getServiciosDeInstructor(id);
            
            //navegate(`/instructor/${id}/servicio/${servicios[0].id}/mi-servicio`)
            navegate(`/instructor/${id}/servicios`);     

          } catch (error) {
            console.error('Error al iniciar sesión:', error);
          }
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
        <div className="container-fluid" style={{ overflow: 'hidden', marginTop: '0vh', fontFamily:'Roboto' }}>
            <div className="row">
                {/* Sección de Imagen */}
                <div className="col-lg-6 d-flex justify-content-center align-items-center bg-light">
                    <img src={PanaTeacher} alt="Login Illustration" className="img-fluid" />
                </div>

                {/* Sección de Formulario */}
                <div className="col-lg-6 d-flex justify-content-center align-items-center">
                    <div className="col-md-8 col-sm-10" style={{ height: '100vh', marginTop: '4em', marginBottom: '2em' }}>
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

                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <label htmlFor="password" className="mb-0">Contraseña</label>
                                            <Link to="/recuperar-contrasena" className="text-primary text-decoration-underline">
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
                                            className="btn fs-5" 
                                        
                                            style={{ backgroundImage: "linear-gradient(135deg, #1E1B4B, #4F46E5)", color: 'white', padding: '6px 17px' }}
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
                                        className="btn btn-danger fs-6"
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
