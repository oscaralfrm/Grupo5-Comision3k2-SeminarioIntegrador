import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap"; // Importamos componentes de React Bootstrap
import Contactos from "./tabs/Contactos";
import DatosPersonales from "./tabs/DatosPersonales";
import InfoCard from "./tabs/InfoCard";
import Password from "./tabs/Password";

export const RegisterFormStudent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: "onChange" });
  const password = watch("password");
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
  const [activeTab, setActiveTab] = useState("datosPersonales");
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

  const goToNextTab = () => {
    if (activeTab === "datosPersonales") {
      setActiveTab("contacto");
    } else if (activeTab === "contacto") {
      setActiveTab("contraseña");
    }
  };

  const goToPreviousTab = () => {
    if (activeTab === "contraseña") {
      setActiveTab("contacto");
    } else if (activeTab === "contacto") {
      setActiveTab("datosPersonales");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        fontFamily: "Roboto",
        flexWrap: "wrap",
      }}
    >
      {/* Columna Izquierda (Formulario) */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className="col-12 col-md-6"
      >
        <div className="col-md-10 col-sm-12 p-4">
          <h1 className="mb-1 text-center fs-1">Regístrate como Alumno</h1>
          <p className="text-center text-muted fs-6">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="card shadow-lg rounded-3 bg-light p-4">
            <Tabs
              id="register-tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
            >
              <Tab eventKey="datosPersonales" title="Datos Personales">
                <DatosPersonales
                  register={register}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  goToNextTab={goToNextTab}
                />
              </Tab>

              <Tab eventKey="contacto" title="Contacto">
                <Contactos
                  register={register}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  goToNextTab={goToNextTab}
                  goToPreviousTab={goToPreviousTab}
                />
              </Tab>

              <Tab eventKey="contraseña" title="Contraseña">
                <Password
                  register={register}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  goToPreviousTab={goToPreviousTab}
                  password={password}
                  isValid={isValid}
                />
              </Tab>
            </Tabs>
          </form>
        </div>
      </div>

      {/* Columna Derecha (InfoCard) */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
         minHeight: "calc(100vh - 290px)"
          
        }}
        className="col-12 col-md-6 col-lg-12 mt-4 mt-md-0 mb-3"
      >
        <InfoCard formData={formData} />
      </div>
    </div>
  );
};



//     <div
//       className="container-fluid h-100 d-flex align-items-center justify-content-center"
//       style={{ fontFamily: "Roboto" }}
//     >
//       {/* Card izquierda */}
//       <div className="col-lg-6 d-flex justify-content-center align-items-center">
//         <div className="col-md-10 col-sm-12 p-4">
//           <h1 className="mb-1 text-center fs-1">Regístrate como Alumno</h1>
//           <p className="text-center text-muted fs-6 ">
//             ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
//           </p>
//           <div className="card shadow-lg rounded-3 bg-light">
//             <div className="card-body p-4">
//               <form onSubmit={handleSubmit(onSubmit)}>
//                 <Tabs
//                   activeKey={activeTab}
//                   onSelect={(key) => setActiveTab(key)}
//                   id="form-tabs"
//                 >
//                   {/* Sección 1: Datos Personales */}
//                   <Tab eventKey="datosPersonales" title="Datos Personales">
//                     <div className="form-group mt-1">
//                       <label htmlFor="nombre">Nombre</label>
//                       <input
//                         type="text"
//                         id="nombre"
//                         name="nombre"
//                         className={`form-control ${
//                           errors.nombre ? "is-invalid" : ""
//                         }`}
//                         placeholder="Nombre"
//                         {...register("nombre", {
//                           required: "El nombre es obligatorio",
//                           pattern: {
//                             value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, // Expresión regular para solo letras y espacios
//                             message: "Solo se permiten letras y espacios",
//                           },
//                           onChange: handleInputChange,
//                         })}
//                       />
//                       {errors.nombre && (
//                         <div className="invalid-feedback">
//                           {errors.nombre.message}
//                         </div>
//                       )}
//                     </div>

//                     <div className="form-group mb-3 mt-1">
//                       <label htmlFor="apellido">Apellido</label>
//                       <input
//                         type="text"
//                         id="apellido"
//                         name="apellido"
//                         className={`form-control ${
//                           errors.apellido ? "is-invalid" : ""
//                         }`}
//                         placeholder="Apellido"
//                         {...register("apellido", {
//                           required: "El apellido es obligatorio",
//                           onChange: handleInputChange,
//                           pattern: {
//                             value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, // Expresión regular para solo letras y espacios
//                             message: "Solo se permiten letras y espacios",
//                           },
//                         })}
//                       />
//                       {errors.apellido && (
//                         <div className="invalid-feedback">
//                           {errors.apellido.message}
//                         </div>
//                       )}
//                     </div>
//                     <div className="form-group mb-3">
//                       <label htmlFor="dni">DNI</label>
//                       <input
//                         type="text"
//                         id="dni"
//                         name="dni"
//                         className={`form-control ${
//                           errors.dni ? "is-invalid" : ""
//                         }`}
//                         placeholder="DNI"
//                         {...register("dni", {
//                           required: "El DNI es obligatorio",
//                           minLength: {
//                             value: 6,
//                             message: "El DNI debe tener al menos 6 dígitos",
//                           },
//                           maxLength: {
//                             value: 8,
//                             message: "El DNI no puede tener más de 8 dígitos",
//                           },
//                           onChange: handleInputChange,
//                         })}
//                       />
//                       {errors.dni && (
//                         <div className="invalid-feedback">
//                           {errors.dni.message}
//                         </div>
//                       )}
//                     </div>

//                     <div className="form-group ">
//                       <label htmlFor="username">Nombre de usuario</label>
//                       <input
//                         type="text"
//                         id="username"
//                         name="username"
//                         className={`form-control ${
//                           errors.username ? "is-invalid" : ""
//                         }`}
//                         placeholder="Nombre de usuario"
//                         {...register("username", {
//                           required: "El nombre de usuario es obligatorio",
//                           onChange: handleInputChange,
//                         })}
//                       />
//                       {errors.username && (
//                         <div className="invalid-feedback">
//                           {errors.username.message}
//                         </div>
//                       )}
//                     </div>
//                     <div
//                       className="d-flex justify-content-end align-items-center"
//                       style={{ cursor: "pointer", margin: 0, padding: 0 }}
//                       onClick={goToNextTab} // Avanzar a la siguiente sección
//                     >
//                       <span className="fs-3" style={{ margin: 0, padding: 0 }}>
//                         &#8594;
//                       </span>
//                     </div>
//                   </Tab>
//                   {/* Sección 2: Contacto */}
//                   <Tab eventKey="contacto" title="Contacto">
//                     <div className="form-group mb-3 mt-2">
//                       <label htmlFor="mail">Email</label>
//                       <input
//                         type="email"
//                         id="mail"
//                         name="mail"
//                         className={`form-control ${
//                           errors.mail ? "is-invalid" : ""
//                         }`}
//                         placeholder="Email"
//                         {...register("mail", {
//                           required: "El email es obligatorio",
//                           pattern: {
//                             value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                             message: "El email no es válido",
//                           },
//                           onChange: handleInputChange,
//                         })}
//                       />
//                       {errors.mail && (
//                         <div className="invalid-feedback">
//                           {errors.mail.message}
//                         </div>
//                       )}
//                     </div>
//                     <div className="form-group mb-3">
//                       <label htmlFor="telefono">Teléfono</label>
//                       <input
//                         type="tel"
//                         id="telefono"
//                         name="telefono"
//                         className={`form-control ${
//                           errors.telefono ? "is-invalid" : ""
//                         }`}
//                         placeholder="Teléfono"
//                         {...register("telefono", {
//                           required: "El teléfono es obligatorio",
//                           pattern: {
//                             value: /^[0-9]{10}$/,
//                             message: "El teléfono debe tener 10 dígitos",
//                           },
//                           onChange: handleInputChange,
//                         })}
//                       />
//                       {errors.telefono && (
//                         <div className="invalid-feedback">
//                           {errors.telefono.message}
//                         </div>
//                       )}
//                     </div>

//                     {/* Botones para navegar entre las pestañas */}
//                     <div className="d-flex justify-content-between">
//                       {/* Flecha para ir a la sección anterior */}
//                       <span
//                         className="fs-3 d-flex justify-content-start ms-0"
//                         onClick={goToPreviousTab}
//                         style={{ cursor: "pointer" }} // Volver a la sección anterior
//                       >
//                         &#8592;
//                       </span>

//                       {/* Flecha para avanzar a la siguiente sección */}
//                       <span
//                         className="fs-3"
//                         style={{ cursor: "pointer" }}
//                         onClick={goToNextTab} // Avanzar a la siguiente sección
//                       >
//                         &#8594;
//                       </span>
//                     </div>
//                   </Tab>

//                   {/* Sección 3: Contraseña */}
//                   <Tab eventKey="contraseña" title="Contraseña">
//                     <div className="form-group mb-3 mt-2">
//                       <label htmlFor="password">Contraseña</label>
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         id="password"
//                         name="password"
//                         className={`form-control ${
//                           errors.password ? "is-invalid" : ""
//                         }`}
//                         placeholder="Contraseña"
//                         {...register("password", {
//                           required: "La contraseña es obligatoria",
//                           minLength: {
//                             value: 8,
//                             message:
//                               "La contraseña debe tener al menos 8 caracteres",
//                           },
//                           onChange: handleInputChange,
//                         })}
//                       />
//                       {errors.password && (
//                         <div className="invalid-feedback">
//                           {errors.password.message}
//                         </div>
//                       )}
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="btn btn-link"
//                       >
//                         {showPassword ? "Ocultar" : "Mostrar"}
//                       </button>
//                     </div>
//                     <div className="form-group mb-3">
//                       <label htmlFor="confirmPassword">
//                         Confirmar Contraseña
//                       </label>
//                       <input
//                         type={showConfirmPassword ? "text" : "password"}
//                         id="confirmPassword"
//                         name="confirmPassword"
//                         className={`form-control ${
//                           errors.confirmPassword ? "is-invalid" : ""
//                         }`}
//                         placeholder="Confirmar Contraseña"
//                         {...register("confirmPassword", {
//                           required: "Por favor, confirma tu contraseña",
//                           validate: (value) =>
//                             value === password ||
//                             "Las contraseñas no coinciden",
//                           onChange: handleInputChange,
//                         })}
//                       />
//                       {errors.confirmPassword && (
//                         <div className="invalid-feedback">
//                           {errors.confirmPassword.message}
//                         </div>
//                       )}
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setShowConfirmPassword(!showConfirmPassword)
//                         }
//                         className="btn btn-link"
//                       >
//                         {showConfirmPassword ? "Ocultar" : "Mostrar"}
//                       </button>
//                     </div>
//                     <div
//                       className="d-flex justify-content-between"
//                       style={{ cursor: "pointer" }}
//                     >
//                       <span
//                         className="fs-3"
//                         onClick={goToPreviousTab} // Volver a la sección anterior
//                       >
//                         &#8592;
//                       </span>
//                       <button
//                         type="submit"
//                         className="btn btn-primary"
//                         disabled={!isValid} // Deshabilitar si el formulario no es válido
//                       >
//                         Regístrate
//                       </button>
//                     </div>
//                   </Tab>
//                 </Tabs>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Card para visualizar la información ingresada */}
//       <div className="col-lg-6 d-flex justify-content-center align-items-center">
//         <div className="col-md-10 col-sm-12 p-4">
//           <div
//             className="card shadow-lg rounded-3 bg-light"
//             style={{ transition: "0.3s" }}
//           >
//             {/* Encabezado de "Información Ingresada" ajustado */}
//             <div
//               className="d-flex justify-content-center align-items-center"
//               style={{
//                 backgroundColor: "#1E1B4B",
//                 padding: "1rem",
//                 borderTopLeftRadius: "0.375rem",
//                 borderTopRightRadius: "0.375rem",
//                 boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//               }}
//             >
//               <h1
//                 className="mb-3 text-center fs-1 text-white"
//                 style={{ fontFamily: "Roboto", fontWeight: "400" }}
//               >
//                 Información Ingresada
//               </h1>
//             </div>
//             <div
//               className="card-body p-4"
//               style={{
//                 backgroundColor: "#FFFFFF", // Fondo blanco sin degradado
//                 borderRadius: "10px",
//                 boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//               }}
//             >
//               {/* Información del formulario */}
//               <div className="mb-3">
//                 <strong style={{ fontSize: "1.2rem" }}>Nombre: </strong>
//                 <span style={{ fontSize: "1.1rem", color: "#333" }}>
//                   {formData.nombre}
//                 </span>
//               </div>
//               <div className="mb-3">
//                 <strong style={{ fontSize: "1.2rem" }}>Apellido: </strong>
//                 <span style={{ fontSize: "1.1rem", color: "#333" }}>
//                   {formData.apellido}
//                 </span>
//               </div>
//               <div className="mb-3">
//                 <strong style={{ fontSize: "1.2rem" }}>DNI: </strong>
//                 <span style={{ fontSize: "1.1rem", color: "#333" }}>
//                   {formData.dni}
//                 </span>
//               </div>
//               <div className="mb-3">
//                 <strong style={{ fontSize: "1.2rem" }}>
//                   Nombre de usuario:{" "}
//                 </strong>
//                 <span style={{ fontSize: "1.1rem", color: "#333" }}>
//                   {formData.username}
//                 </span>
//               </div>
//               <div className="mb-3">
//                 <strong style={{ fontSize: "1.2rem" }}>Email: </strong>
//                 <span style={{ fontSize: "1.1rem", color: "#333" }}>
//                   {formData.mail}
//                 </span>
//               </div>
//               <div className="mb-3">
//                 <strong style={{ fontSize: "1.2rem" }}>Teléfono: </strong>
//                 <span style={{ fontSize: "1.1rem", color: "#333" }}>
//                   {formData.telefono}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// {
//   /* Estilos adicionales */
// }
// <style>
//   {`
//     .card {
//       transition: transform 0.3s ease, box-shadow 0.3s ease;
//     }
//     .card:hover {
//       transform: translateY(-5px);
//       box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
//     }

//     .card-body {
//       background-color: #FFFFFF; /* Fondo blanco sin degradado */
//     }

//     .card-body .mb-3 {
//       padding-bottom: 1rem;
//     }

//     .card-body strong {
//       font-weight: 600;
//       color: #4F46E5;
//     }
//   `}
// </style>;
