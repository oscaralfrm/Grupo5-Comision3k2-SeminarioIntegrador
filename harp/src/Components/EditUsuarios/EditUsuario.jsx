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
import {
  editAlumno
} from "../../services/Alumno.js";

export const EditUsuario = () => {
  const params = useParams();
  const location = useLocation();
  const [id, setId] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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
      fotoPerfil: "",
      fotoPerfilURL: ""
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

  const [activeTab, setActiveTab] = useState("datosPersonales");

  const onSubmit = async (data) => {
    try {
      if (tipoUsuario.trim().toLowerCase() === "instructor") {
        const instructorDTO = {
          idInstructor: id,
          nombre: data.nombre,
          apellido: data.apellido,
          dni: usuario.dni,
          nombreUsuario: data.nombreUsuario,
          contrasena: data.contrasena,
          email: usuario.email,
          telefono: data.telefono,
          direccion: usuario.direccion,
          fechaNacimiento: data.fechaNacimiento
        }
        
        // Si el usuario seleccionó un nuevo archivo, data.logo vendrá como FileList
        if (data.fotoPerfil && data.fotoPerfil.length > 0 && data.fotoPerfil[0] instanceof File) {
          instructorDTO.fotoPerfil = data.fotoPerfil[0];
        }
        console.log("instructorDTO", instructorDTO);
        await editInstructor(instructorDTO);
      } else if (tipoUsuario.trim().toLowerCase() === "alumno") {
        await editAlumno(
          id,
          data.nombre,
          data.apellido,
          data.dni,
          data.nombreUsuario,
          data.contrasena,
          data.email,
          data.telefono,
          data.fechaNacimiento,
          data.fotoPerfil[0]
        );
      }
      navigate(-1);
    } catch (error) {
      console.error("Error:", error);
      alert(
        `Hubo un problema al editar al ${tipoUsuario}. Por favor, inténtalo nuevamente.`
      );
    }
  };

  const onError = (errors) => {
    // Construye un mensaje de error
    let mensaje = "El formulario contiene errores:\n";
    for (const field in errors) {
      mensaje += `- ${errors[field].message}\n`;
    }
    alert(mensaje);
  };

  const validateField = (fieldName, value) => {
    // Si el valor es igual al inicial, no es necesario validarlo
    if (usuario && value === usuario[fieldName]) return true;

    // Si el valor es una cadena, aplicar trim
    if (typeof value === "string") {
      return value.trim() !== "" || "Este campo no puede estar vacío";
    }

    // Si el campo es, por ejemplo, 'fotoPerfil' (o cualquier campo que no sea string)
    // Puedes personalizar la validación. Por ejemplo, asegurarte de que se haya seleccionado un archivo:
    //if (fieldName === "fotoPerfil") {
    //  return value && value.length > 0 || "Debes seleccionar una foto de perfil";
    //}

    // Para otros tipos de datos, se puede convertir a cadena o evaluar de otra forma
    return value ? true : "Este campo no puede estar vacío";
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
            onSubmit={handleSubmit(onSubmit, onError)}
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
