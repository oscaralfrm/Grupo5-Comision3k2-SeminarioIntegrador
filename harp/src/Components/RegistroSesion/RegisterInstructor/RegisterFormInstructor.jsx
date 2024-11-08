import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap"; // Importamos componentes de React Bootstrap

export const RegisterFormInstructor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    username: "",
    mail: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setFormData(data);
    alert("Formulario enviado con éxito");
    console.log(data); // Aquí puedes manejar el envío de los datos
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div
      className="container-fluid h-100 d-flex align-items-center justify-content-center"
      style={{ fontFamily: "Roboto" }}
    >
      <div className="row w-100">
        {/* Card para el formulario de registro */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <div className="col-md-10 col-sm-12 p-4">
            <h1 className="mb-3 text-center fs-1">
              Regístrate como Instructor
            </h1>
            <p className="text-center text-muted fs-6">
              ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
            </p>
            <div className="card shadow-lg rounded-3 bg-light">
              <div className="card-body p-4">
                <Tabs defaultActiveKey="datosPersonales" id="form-tabs">
                  {/* Sección 1: Datos Personales */}
                  <Tab eventKey="datosPersonales" title="Datos Personales">
                    <div className="form-group mb-3">
                      <label htmlFor="nombre">Nombre</label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className={`form-control ${
                          errors.nombre ? "is-invalid" : ""
                        }`}
                        placeholder="Nombre"
                        {...register("nombre", {
                          required: "El nombre es obligatorio",
                          onChange: handleInputChange,
                        })}
                      />
                      {errors.nombre && (
                        <div className="invalid-feedback">
                          {errors.nombre.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="apellido">Apellido</label>
                      <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        className={`form-control ${
                          errors.apellido ? "is-invalid" : ""
                        }`}
                        placeholder="Apellido"
                        {...register("apellido", {
                          required: "El apellido es obligatorio",
                          onChange: handleInputChange,
                        })}
                      />
                      {errors.apellido && (
                        <div className="invalid-feedback">
                          {errors.apellido.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="dni">DNI</label>
                      <input
                        type="text"
                        id="dni"
                        name="dni"
                        className={`form-control ${
                          errors.dni ? "is-invalid" : ""
                        }`}
                        placeholder="DNI"
                        {...register("dni", {
                          required: "El DNI es obligatorio",
                          onChange: handleInputChange,
                        })}
                      />
                      {errors.dni && (
                        <div className="invalid-feedback">
                          {errors.dni.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="username">Nombre de usuario</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        className={`form-control ${
                          errors.username ? "is-invalid" : ""
                        }`}
                        placeholder="Nombre de usuario"
                        {...register("username", {
                          required: "El nombre de usuario es obligatorio",
                          onChange: handleInputChange,
                        })}
                      />
                      {errors.username && (
                        <div className="invalid-feedback">
                          {errors.username.message}
                        </div>
                      )}
                    </div>
                  </Tab>

                  {/* Sección 2: Contacto */}
                  <Tab eventKey="contacto" title="Contacto">
                    <div className="form-group mb-3">
                      <label htmlFor="mail">Email</label>
                      <input
                        type="email"
                        id="mail"
                        name="mail"
                        className={`form-control ${
                          errors.mail ? "is-invalid" : ""
                        }`}
                        placeholder="Email"
                        {...register("mail", {
                          required: "El email es obligatorio",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "El email no es válido",
                          },
                          onChange: handleInputChange,
                        })}
                      />
                      {errors.mail && (
                        <div className="invalid-feedback">
                          {errors.mail.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="telefono">Teléfono</label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        className={`form-control ${
                          errors.telefono ? "is-invalid" : ""
                        }`}
                        placeholder="Teléfono"
                        {...register("telefono", {
                          required: "El teléfono es obligatorio",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "El teléfono debe tener 10 dígitos",
                          },
                          onChange: handleInputChange,
                        })}
                      />
                      {errors.telefono && (
                        <div className="invalid-feedback">
                          {errors.telefono.message}
                        </div>
                      )}
                    </div>
                  </Tab>

                  {/* Sección 3: Contraseña */}
                  <Tab eventKey="contraseña" title="Contraseña">
                    <div className="form-group mb-3">
                      <label htmlFor="password">Contraseña</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        placeholder="Contraseña"
                        {...register("password", {
                          required: "La contraseña es obligatoria",
                          minLength: {
                            value: 8,
                            message:
                              "La contraseña debe tener al menos 8 caracteres",
                          },
                          onChange: handleInputChange,
                        })}
                      />
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password.message}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn btn-link"
                      >
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="confirmPassword">
                        Confirmar Contraseña
                      </label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        className={`form-control ${
                          errors.confirmPassword ? "is-invalid" : ""
                        }`}
                        placeholder="Confirmar Contraseña"
                        {...register("confirmPassword", {
                          required:
                            "La confirmación de la contraseña es obligatoria",
                          validate: (value) =>
                            value === password ||
                            "Las contraseñas no coinciden",
                          onChange: handleInputChange,
                        })}
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">
                          {errors.confirmPassword.message}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="btn btn-link"
                      >
                        {showConfirmPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                    <div className="form-group mb-3">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleSubmit(onSubmit)}
                      >
                        Registrarme
                      </button>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>

        {/* Card para visualizar la información ingresada */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <div className="col-md-10 col-sm-12 p-4">
            <div className="card shadow-lg rounded-3 bg-light" >
              {/* Encabezado de "Información Ingresada" ajustado */}
              <div className="d-flex justify-content-center align-items-center "
                style={{
                  backgroundColor: "#4F46E5",
                  padding: "0rem",
                  borderTopLeftRadius: "0.375rem",
                  borderTopRightRadius: "0.375rem",
                }}
              >
                <h1 className="mb-3 text-center fs-1 text-white">
                  Información Ingresada
                </h1>
              </div>
              <div className="card-body p-4" style={{backgroundColor:"#A5B4FC"}}>
                <div className="mb-3">
                  <strong>Nombre: </strong>
                  {formData.nombre}
                </div>
                <div className="mb-3">
                  <strong>Apellido: </strong>
                  {formData.apellido}
                </div>
                <div className="mb-3">
                  <strong>DNI: </strong>
                  {formData.dni}
                </div>
                <div className="mb-3">
                  <strong>Nombre de usuario: </strong>
                  {formData.username}
                </div>
                <div className="mb-3">
                  <strong>Email: </strong>
                  {formData.mail}
                </div>
                <div className="mb-3">
                  <strong>Teléfono: </strong>
                  {formData.telefono}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
