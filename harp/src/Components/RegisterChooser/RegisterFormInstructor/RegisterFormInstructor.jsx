import { useForm } from 'react-hook-form';
import InstructorImage from '../../../assets/PanaInstructor.png'; // Asegúrate de importar tu imagen

export const RegisterFormInstructor = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch('password'); // Para comparar la contraseña y su confirmación

    const onSubmit = async (data) => {
        const newInstructor = {
            nombre: data.nombre,
            apellido: data.apellido,
            mail: data.mail,
            telefono: data.telefono,
            password: data.password,
            especialidad: data.especialidad,  // Nueva especialidad para instructores
            notifyMe: data.notifyMe,
        };

        try {
            alert('Registro exitoso para el instructor');
        } catch (error) {
            alert('Error al registrar: ' + error.message);
        }
    };

    return (
        <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
            <div className="row w-100">
                {/* Sección de Formulario */}
                <div className="col-lg-6 d-flex justify-content-center align-items-center">
                    <div className="col-md-10 col-sm-12" style={{ height: '100%', margin: '2em'}}>
                        <h1 className="mb-3" style={{ marginTop: '1.5em', marginBottom: '1.5em'}}>Regístrate como Instructor</h1>
                        <p className="mb-4">¿Ya eres instructor? <a href="/login">Inicia sesión aquí</a></p>
                        <div className="card shadow-lg" style={{ borderRadius: '20px', padding: '2em' }}>
                            <div className="card-body">
                                <form className="mt-3" onSubmit={handleSubmit(onSubmit)} id="register-instructor">
                                    {/* Campos del formulario */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="nombre">Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            id="nombre"
                                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                            placeholder="Nombre"
                                            {...register('nombre', { required: 'El nombre es obligatorio' })}
                                        />
                                        {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="apellido">Apellido</label>
                                        <input
                                            type="text"
                                            name="apellido"
                                            id="apellido"
                                            className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                                            placeholder="Apellido"
                                            {...register('apellido', { required: 'El apellido es obligatorio' })}
                                        />
                                        {errors.apellido && <div className="invalid-feedback">{errors.apellido.message}</div>}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="mail">Email</label>
                                        <input
                                            type="email"
                                            name="mail"
                                            id="mail"
                                            className={`form-control ${errors.mail ? 'is-invalid' : ''}`}
                                            placeholder="Email"
                                            {...register('mail', {
                                                required: 'El email es obligatorio',
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: 'El email no es válido'
                                                }
                                            })}
                                        />
                                        {errors.mail && <div className="invalid-feedback">{errors.mail.message}</div>}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="telefono">Teléfono</label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            id="telefono"
                                            className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                                            placeholder="Teléfono"
                                            {...register('telefono', {
                                                required: 'El teléfono es obligatorio',
                                                pattern: {
                                                    value: /^[0-9]{10}$/,
                                                    message: 'El teléfono debe tener 10 dígitos'
                                                }
                                            })}
                                        />
                                        {errors.telefono && <div className="invalid-feedback">{errors.telefono.message}</div>}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="password">Contraseña</label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            placeholder="Contraseña"
                                            {...register('password', {
                                                required: 'La contraseña es obligatoria',
                                                minLength: {
                                                    value: 8,
                                                    message: 'La contraseña debe tener al menos 8 caracteres'
                                                },
                                                pattern: {
                                                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
                                                    message: 'Debe contener al menos una letra, un número y un símbolo'
                                                }
                                            })}
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            placeholder="Repite la contraseña"
                                            {...register('confirmPassword', {
                                                required: 'Debes confirmar la contraseña',
                                                validate: value => value === password || 'Las contraseñas no coinciden'
                                            })}
                                        />
                                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                                    </div>

                                    {/* Campo adicional para Especialidad del Instructor */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="especialidad">Especialidad</label>
                                        <input
                                            type="text"
                                            name="especialidad"
                                            id="especialidad"
                                            className={`form-control ${errors.especialidad ? 'is-invalid' : ''}`}
                                            placeholder="Especialidad"
                                            {...register('especialidad', { required: 'La especialidad es obligatoria' })}
                                        />
                                        {errors.especialidad && <div className="invalid-feedback">{errors.especialidad.message}</div>}
                                    </div>

                                    <div className="form-group form-check mb-3">
                                        <input
                                            type="checkbox"
                                            name="notifyMe"
                                            id="notifyMe"
                                            className="form-check-input"
                                            {...register('notifyMe')}
                                        />
                                        <label className="form-check-label" htmlFor="notifyMe">Quiero recibir novedades</label>
                                    </div>

                                    {/* Botón Registrarme */}
                                    <div className="d-flex justify-content-center mt-4">
                                        <button
                                            type="submit"
                                            className="btn fs-4"
                                            style={{
                                                backgroundImage: 'linear-gradient(135deg, #1E1B4B, #4F46E5)',
                                                color: 'white',
                                                padding: '12px 24px'
                                            }}
                                        >
                                            Registrarme
                                        </button>
                                    </div>

                                    <hr />

                                    {/* Centrar el texto */}
                                    <div className="text-center">
                                        <span>O sino, regístrate usando:</span>
                                    </div>

                                    {/* Botón Registrarse con Google */}
                                    <div className="d-flex justify-content-center mt-3">
                                        <button
                                            type="button"
                                            className="btn fs-4"
                                            style={{
                                                backgroundColor: 'red',
                                                color: 'white',
                                                padding: '10px 20px'
                                            }}
                                        >
                                            <i className="bi bi-google"></i> Google
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de Imagen */}
                <div className="col-lg-6 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#A5B4FC'}}>
                    <img src={InstructorImage} alt="Instructor Register Illustration" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
            </div>
        </div>
    );
};
