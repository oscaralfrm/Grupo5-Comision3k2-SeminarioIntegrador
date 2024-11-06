import { useForm } from "react-hook-form";
import PanaRegister from "../../../assets/PanaAlumnaInscripcion.png";

export const RegisterFormStudent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    const newUser = {
      nombre: data.nombre,
      apellido: data.apellido,
      mail: data.mail,
      telefono: data.telefono,
      password: data.password,
      notifyMe: data.notifyMe,
    };

    try {
      alert("Registro exitoso");
    } catch (error) {
      alert("Error al registrar: " + error.message);
    }
  };

  return (
    <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        {/* Sección de Formulario */}
        <div className="col-lg-6 d-flex flex-column align-items-center">
          <div className="position-absolute top-0 start-0 m-3">
            <i
              className="bi bi-arrow-left fs-4 text-dark"
              onClick={() => window.history.back()}
              role="button"
            ></i>
          </div>
          <div className="col-md-10 col-sm-12 my-5">
            <h1 className="mb-3 text-center">Regístrate como Alumno</h1>
            <p className="mb-4 text-center">
              ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
            </p>
            <div className="card shadow-lg">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit(onSubmit)} id="register">
                  {/* Campos del formulario */}
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                      id="nombre"
                      placeholder="Nombre"
                      {...register("nombre", { required: "El nombre es obligatorio" })}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="apellido" className="form-label">Apellido</label>
                    <input
                      type="text"
                      className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
                      id="apellido"
                      placeholder="Apellido"
                      {...register("apellido", { required: "El apellido es obligatorio" })}
                    />
                    {errors.apellido && <div className="invalid-feedback">{errors.apellido.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="dni" className="form-label">DNI</label>
                    <input
                      type="text"
                      className={`form-control ${errors.dni ? "is-invalid" : ""}`}
                      id="dni"
                      placeholder="DNI"
                      {...register("dni", {
                        required: "El DNI es obligatorio",
                        pattern: { value: /^[0-9]{7,8}$/, message: "El DNI debe tener entre 7 y 8 dígitos" },
                      })}
                    />
                    {errors.dni && <div className="invalid-feedback">{errors.dni.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="mail" className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.mail ? "is-invalid" : ""}`}
                      id="mail"
                      placeholder="Email"
                      {...register("mail", {
                        required: "El email es obligatorio",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "El email no es válido" },
                      })}
                    />
                    {errors.mail && <div className="invalid-feedback">{errors.mail.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                      id="telefono"
                      placeholder="Teléfono"
                      {...register("telefono", {
                        required: "El teléfono es obligatorio",
                        pattern: { value: /^[0-9]{10}$/, message: "El teléfono debe tener 10 dígitos" },
                      })}
                    />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      id="password"
                      placeholder="Contraseña"
                      {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: { value: 8, message: "La contraseña debe tener al menos 8 caracteres" },
                        pattern: {
                          value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
                          message: "Debe contener al menos una letra, un número y un símbolo",
                        },
                      })}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      id="confirmPassword"
                      placeholder="Repite la contraseña"
                      {...register("confirmPassword", {
                        required: "Debes confirmar la contraseña",
                        validate: (value) => value === password || "Las contraseñas no coinciden",
                      })}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                  </div>

                  {/* Botón Registrarme */}
                  <div className="d-flex justify-content-center mt-4">
                    <button type="submit" className="btn btn-sm btn-primary fs-6 px-3 py-1">
                      Registrarte
                    </button>
                  </div>

                  <hr />

                  <div className="text-center mb-3">O sino, regístrate usando:</div>

                  {/* Botón Registrarse con Google */}
                  <div className="d-flex justify-content-center mt-4">
                    <button type="button" className="btn  btn-danger fs-6 px-3 py-1">
                      <i className="bi bi-google"></i> Google
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Imagen */}
        <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center bg-light">
          <img src={PanaRegister} alt="Registro de Alumno" className="img-fluid" />
        </div>
      </div>
    </div>
  );
};
