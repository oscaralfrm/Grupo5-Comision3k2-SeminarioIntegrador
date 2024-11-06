import { useForm } from "react-hook-form";
import InstructorImage from "../../../assets/PanaInstructor.png"; // Asegúrate de importar tu imagen

export const RegisterFormInstructor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = watch("password"); // Para comparar la contraseña y su confirmación

  const onSubmit = async (data) => {
    const newInstructor = {
      nombre: data.nombre,
      apellido: data.apellido,
      mail: data.mail,
      telefono: data.telefono,
      password: data.password,
      especialidad: data.especialidad,
      notifyMe: data.notifyMe,
    };

    try {
      alert("Registro exitoso para el instructor");
      // Aquí podrías enviar newInstructor a tu API
    } catch (error) {
      alert("Error al registrar: " + error.message);
    }
  };

  return (
    <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        
        {/* Sección de Formulario */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <div className="position-absolute top-0 start-0 p-3">
            <i className="bi bi-arrow-left fs-3 text-dark" onClick={() => window.history.back()} role="button"></i>
          </div>
          <div className="col-md-10 col-sm-12 p-4">
            <h1 className="mb-3 text-center fs-1">Regístrate como Instructor</h1>
            <p className="text-center text-muted fs-6">
              ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
            </p>
            <div className="card shadow-lg rounded-3 bg-light">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit(onSubmit)} id="register-instructor">
                  
                  {/* Campos del formulario */}
                  <div className="form-group mb-3">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                      placeholder="Nombre"
                      {...register("nombre", { required: "El nombre es obligatorio" })}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="apellido">Apellido</label>
                    <input
                      type="text"
                      id="apellido"
                      className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
                      placeholder="Apellido"
                      {...register("apellido", { required: "El apellido es obligatorio" })}
                    />
                    {errors.apellido && <div className="invalid-feedback">{errors.apellido.message}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="dni">DNI</label>
                    <input
                      type="text"
                      id="dni"
                      className={`form-control ${errors.dni ? "is-invalid" : ""}`}
                      placeholder="DNI"
                      {...register("dni", {
                        required: "El DNI es obligatorio",
                        pattern: {
                          value: /^[0-9]{7,8}$/,
                          message: "El DNI debe tener entre 7 y 8 dígitos",
                        },
                      })}
                    />
                    {errors.dni && <div className="invalid-feedback">{errors.dni.message}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="mail">Email</label>
                    <input
                      type="email"
                      id="mail"
                      className={`form-control ${errors.mail ? "is-invalid" : ""}`}
                      placeholder="Email"
                      {...register("mail", {
                        required: "El email es obligatorio",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "El email no es válido",
                        },
                      })}
                    />
                    {errors.mail && <div className="invalid-feedback">{errors.mail.message}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                      placeholder="Teléfono"
                      {...register("telefono", {
                        required: "El teléfono es obligatorio",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "El teléfono debe tener 10 dígitos",
                        },
                      })}
                    />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono.message}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="especialidad">Especialidad</label>
                    <input
                      type="text"
                      id="especialidad"
                      className={`form-control ${errors.especialidad ? "is-invalid" : ""}`}
                      placeholder="Especialidad"
                      {...register("especialidad", { required: "La especialidad es obligatoria" })}
                    />
                    {errors.especialidad && <div className="invalid-feedback">{errors.especialidad.message}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input
                      type="text"
                      id="username"
                      className={`form-control ${errors.username ? "is-invalid" : ""}`}
                      placeholder="Nombre de Usuario"
                      {...register("username", {
                        required: "El nombre de usuario es obligatorio",
                        minLength: {
                          value: 4,
                          message: "El nombre de usuario debe tener al menos 4 caracteres",
                        },
                      })}
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="password">Contraseña</label>
                    <input
                      type="password"
                      id="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      placeholder="Contraseña"
                      {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: {
                          value: 8,
                          message: "La contraseña debe tener al menos 8 caracteres",
                        },
                        pattern: {
                          value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%?&])[A-Za-z\d$@$!%*?&]{8,}$/,
                          message: "Debe contener al menos una letra, un número y un símbolo",
                        },
                      })}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      placeholder="Repite la contraseña"
                      {...register("confirmPassword", {
                        required: "Debes confirmar la contraseña",
                        validate: (value) => value === password || "Las contraseñas no coinciden",
                      })}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                  </div>

                  <div className="d-flex justify-content-center mt-4">
                    <button type="submit" className="btn btn-primary fs-6 px-3 py-1">
                      Registrarte
                    </button>
                  </div>

                  <hr />

                  <div className="text-center">
                    <span>O sino, regístrate usando:</span>
                  </div>

                  <div className="d-flex justify-content-center mt-3">
                    <button type="button" className="btn btn-danger fs-6 px-3 py-1">
                      <i className="bi bi-google"></i> Google
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de imagen */}
        <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
          <img src={InstructorImage} alt="Imagen ilustrativa" className="img-fluid rounded-3 bg-light p-3" />
        </div>
      </div>
    </div>
  );
};
