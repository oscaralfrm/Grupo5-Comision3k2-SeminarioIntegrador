import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { createInstructor } from "../../../services/Instructor.js";
import DatosPersonales from "./Tabs/DatosPersonales.jsx";
import InfoCard from "./Tabs/InfoCard.jsx";
import Contacto from "./Tabs/Contacto.jsx";
import Password from "./Tabs/Password.jsx";

export const RegisterFormInstructor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: "onChange" });

  const contrasena = watch("contrasena");
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("datosPersonales");

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const instructorCreado = await createInstructor(
        data.nombre,
        data.apellido,
        data.dni,
        data.username,         // Consistencia: `username` en lugar de `nombreUsuario`
        data.password,         // Consistencia: `password` en lugar de `contrasena`
        data.email,
        data.telefono,
        data.direccion,
        data.fechaNacimiento
      );

      navigate(`/instructor/${instructorCreado.id}/crear-servicio`);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al registrar al instructor. Por favor, inténtalo nuevamente.");
    }
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
          <h1 className="mb-1 text-center fs-1 text-nowrap">Regístrate como Instructor</h1>
          <p className="text-center text-muted fs-6">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card shadow-lg rounded-3 bg-light p-4"
          >
            {/* Tabs siempre visibles */}
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
                  goToNextTab={goToNextTab}
                />
              </Tab>

              <Tab eventKey="contacto" title="Contacto">
                <Contacto
                  register={register}
                  errors={errors}
                  goToNextTab={goToNextTab}
                  goToPreviousTab={goToPreviousTab}
                />
              </Tab>

              <Tab eventKey="contraseña" title="Contraseña">
                <Password
                  register={register}
                  errors={errors}
                  goToPreviousTab={goToPreviousTab}
                  contrasena={contrasena}
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
          minHeight: "calc(100vh - 290px)",
        }}
        className="col-12 col-md-6 col-lg-12 mt-4 mt-md-0 mb-3"
      >
        <InfoCard formData={watch()} />
      </div>

      {/* Botón siempre visible */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <button type="submit" className="btn btn-primary">
          Registrar
        </button>
      </div>
    </div>
  );
};
