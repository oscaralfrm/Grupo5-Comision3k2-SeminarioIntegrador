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
    try {
      console.log(data)
      const instructorCreado = await createInstructor(
        data.nombre,
        data.apellido,
        data.dni,
        data.nombreUsuario,
        data.contrasena,
        data.email,
        data.telefono,
        data.direccion,
        data.fechaNacimiento
      );
      navigate(`/instructor/${instructorCreado.id}/servicios`);
      //navigate(`/instructor/${instructorCreado.id}/crear-servicio`);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al registrar al instructor. Por favor, inténtalo nuevamente.");
    }
  };

  const goToNextTab = () => {
    if (activeTab === "datosPersonales") setActiveTab("contraseña");
    else if (activeTab === "contraseña") setActiveTab("datosPersonales");
  };

  const goToPreviousTab = () => {
    if (activeTab === "contraseña") setActiveTab("datosPersonales");
    else if (activeTab === "datosPersonales") setActiveTab("contraseña");
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        fontFamily: "Roboto",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {/* Columna Izquierda (Formulario) */}
      <div
        style={{
          flex: "1 1 auto",
          maxWidth: "600px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "20px",
        }}
        className="col-12 col-md-6"
      >
        <div style={{ width: "100%" }}>
          <h1 className="mb-1 text-center fs-1">Regístrate como Instructor</h1>
          <p className="text-center text-muted fs-6">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card shadow-lg rounded-3 bg-light p-4"
            style={{
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
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

              {/*
              <Tab eventKey="contacto" title="Contacto">
                <Contacto
                  register={register}
                  errors={errors}
                  goToNextTab={goToNextTab}
                  goToPreviousTab={goToPreviousTab}
                  
                />
              </Tab>
               */}

              <Tab eventKey="contraseña" title="Datos Perfil">
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
          flex: "1 1 100%",
          maxWidth: "600px",
          width: "100%",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        className="col-12 col-md-6 mt-4 mt-md-0 mb-3"
      >
        <InfoCard formData={watch()} />
      </div>
    </div>
  );
};
