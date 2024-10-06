import { useForm } from 'react-hook-form';

export const RegistroUsuario = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        const newUser = {
            nombre: data.nombre,
            apellido: data.apellido,
            mail: data.mail,
            telefono: data.telefono,
            password: data.password,
            role: data.role, // Instructor o Alumno
        };
        registrationService.doRegister(newUser);
    };

    return (
        <div className="d-flex justify-content-center align-items-center h-75">
            <div className="col-xl-6 col-sm-8 mx-auto">
                <div className="card">
                    <div className="card-header text-left">
                        <i className="bi bi-person-plus"></i> Registrar Usuario
                    </div>
                    <div className="card-body">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <form className="mt-3" onSubmit={handleSubmit(onSubmit)} id="register">

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
                                                    message: 'La contraseña debe contener al menos una letra, un número y un símbolo'
                                                }
                                            })}
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="role">Rol</label>
                                        <select
                                            name="role"
                                            id="role"
                                            className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                            {...register('role', { required: 'Seleccionar un rol es obligatorio' })}
                                        >
                                            <option value="">Selecciona tu rol</option>
                                            <option value="Instructor">Instructor</option>
                                            <option value="Alumno">Alumno</option>
                                        </select>
                                        {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-primary">Registrarse</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistroUsuario;
