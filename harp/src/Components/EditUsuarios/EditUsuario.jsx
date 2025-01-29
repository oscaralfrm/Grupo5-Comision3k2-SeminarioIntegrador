import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import {
  editInstructor,
  getInstructorById,
} from "../../services/Instructor.js";
import DatosPersonales from "./Tabs/DatosPersonales.jsx";
import Contacto from "./Tabs/Contacto.jsx";
import InfoCard from "./Tabs/InfoCard.jsx";
import Password from "./Tabs/Password.jsx";
import { editAlumno } from "../../services/Alumno.js";

export const EditUsuario = () => {
  const params = useParams();
  const location = useLocation();
  const [id, setId] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: "",
      fechaNacimiento: "",
      nombreUsuario: "",
      telefono: "",
      email: "",
      contrasena: "",
    },
  });

  useEffect(() => {
    const determinarUsuario = () => {
      if (location.pathname.startsWith("/instructor")) {
        setId(params.idInstructor || null);
        setTipoUsuario("Instructor");
      } else if (location.pathname.startsWith("/alumno")) {
        setId(params.idAlumno || null);
        setTipoUsuario("Alumno");
      } else {
        setId(null);
        setTipoUsuario(null);
      }
    };

    determinarUsuario();
  }, [location.pathname, params]);

  useEffect(() => {
    const fetchUsuario = async () => {
      if (id && tipoUsuario) {
        try {
          if (tipoUsuario.trim().toLowerCase() === "instructor") {
            const data = await getInstructorById(id);
            setUsuario(data.usuario);
            reset(data.usuario); // Actualizar los valores del formulario después de obtener los datos
          } else if (tipoUsuario.trim().toLowerCase() === "alumno") {
            const data = await getAlumnoById(id);
            setUsuario(data);
            reset(data); // Actualizar los valores del formulario después de obtener los datos
          } else {
            console.log("Tipo de usuario no reconocido");
          }
        } catch (err) {
          setError(`Error al obtener datos del ${tipoUsuario}: ${err.message}`);
        }
      }
    };
    fetchUsuario();
  }, [id, tipoUsuario, reset]);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("datosPersonales");

  const onSubmit = async (data) => {
    try {
      if (tipoUsuario.trim().toLowerCase() === "instructor") {
        await editInstructor(
          id,
          data.nombre,
          data.apellido,
          data.dni,
          usuario.email,
          data.contrasena,
          data.telefono,
          data.fechaNacimiento
        );
      } else if (tipoUsuario.trim().toLowerCase() === "alumno") {
        await editAlumno(
          id,
          data.nombre,
          data.apellido,
          data.dni,
          data.contrasena,
          data.telefono,
          data.fechaNacimiento
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        `Hubo un problema al editar al ${tipoUsuario}. Por favor, inténtalo nuevamente.`
      );
    }
  };

  const validateField = (fieldName, value) => {
    // Si el valor es igual al inicial, no es necesario validarlo
    if (usuario && value === usuario[fieldName]) return true;

    // Validar que el campo no esté vacío si fue modificado
    return value.trim() !== "" || "Este campo no puede estar vacío";
  };

  const goToNextTab = () => {
    if (activeTab === "datosPersonales") setActiveTab("contacto");
    else if (activeTab === "contacto") setActiveTab("contraseña");
  };

  const goToPreviousTab = () => {
    if (activeTab === "contraseña") setActiveTab("contacto");
    else if (activeTab === "contacto") setActiveTab("datosPersonales");
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
        marginTop: "3rem",
      }}
    >
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
          <h1 className="mb-1 text-center fs-1">Editar información de cuenta</h1>
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
                  register={(name, options) =>
                    register(name, {
                      ...options,
                      validate: (value) => validateField(name, value),
                    })
                  }
                  errors={errors}
                  goToNextTab={goToNextTab}
                  data={usuario}
                />
              </Tab>

              <Tab eventKey="contacto" title="Contacto">
                <Contacto
                  register={(name, options) =>
                    register(name, {
                      ...options,
                      validate: (value) => validateField(name, value),
                    })
                  }
                  errors={errors}
                  goToNextTab={goToNextTab}
                  goToPreviousTab={goToPreviousTab}
                  data={usuario}
                />
              </Tab>

              <Tab eventKey="contraseña" title="Contraseña">
                <Password
                  register={(name, options) =>
                    register(name, {
                      ...options,
                      validate: (value) => validateField(name, value),
                    })
                  }
                  errors={errors}
                  goToPreviousTab={goToPreviousTab}
                  isValid={isValid}
                  data={usuario}
                />
              </Tab>
            </Tabs>
          </form>
        </div>
      </div>

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
        {console.log(watch())}
      </div>
    </div>
  );
};
