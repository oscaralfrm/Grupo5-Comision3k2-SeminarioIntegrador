import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAllCategorias } from "../../../services/Categoria";
import { createServicio } from "../../../services/Servicio";
import General from "./Tabs/General";
import Cobros from "./Tabs/Cobros";
import Modalidad from "./Tabs/Modalidad";
import ResumenServicio from "./Tabs/InfoCard";
import { Tab, Tabs, Button } from "react-bootstrap";
import SuccessModal from "../../CartelDeExito/CartelDeExito";

export default function ServicioForm() {
  const [activeTab, setActiveTab] = useState("general");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  // Agrega estado para la vista previa del logo
  const [logoPreview, setLogoPreview] = useState("");
  const { idInstructor } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombreServicio: '',
      descripcion: '',
      ubicacion: '',
      categoria: '',
      frecuenciaCuotas: '',
      clasePrueba: '',
      asistencia: '',
      montoInscripcion: 0,
      modalidadClases: "",
      modalidadInscripcion: ""
      // Puedes inicializar "logo" si lo requieres
    },
  });

  const formData = watch();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await getAllCategorias();
        setCategorias(response);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  function obtenerValoresCiclo(frecuenciaCuotas, duracionCuotasPersonalizada) {
    switch (frecuenciaCuotas) {
      case "mensual":
        return { cantidad: 1, unidad: "MONTHS" };
      case "semanal":
        return { cantidad: 1, unidad: "WEEKS" };
      case "diario":
        return { cantidad: 1, unidad: "DAYS" };
      case "otros":
        if (duracionCuotasPersonalizada % 7 === 0) {
          return { cantidad: duracionCuotasPersonalizada / 7, unidad: "WEEKS" };
        } else {
          return { cantidad: duracionCuotasPersonalizada, unidad: "DAYS" };
        }
      default:
        throw new Error("Frecuencia de cobro no válida");
    }
  }

  const onSubmit = async (data) => {
    console.log("isValid:", isValid); // Agregar esta línea
    console.log("errors:", errors); // Agregar esta línea
    if (!isValid) {
      const errorMessages = Object.values(errors).map((error) => error.message);
      alert(`El formulario no es válido:\n${errorMessages.join("\n")}`);
      return;
    }
    console.log(data.logo);
    console.log(data.logo[0]);
    const ciclo = obtenerValoresCiclo(data.frecuenciaCuotas, data.duracionCuotasPersonalizada);
    const servicioDTO = {
      nombre: data.nombreServicio,
      idInstructor: idInstructor,
      descripcion: data.descripcion,
      ubicacion: data.ubicacion,
      categoria: data.categoria,
      tipoCiclo:
        data.ciclos === "En fechas fijas"
          ? "SegunCalendario"
          : "SegunInscripcion",
      diaLimitePago: data.fechaLimitePago > 0 ? data.fechaLimitePago : 0,
      cantCiclo: ciclo.cantidad,
      unidadCiclo: ciclo.unidad,
      modalidadInscripcion:
        data.divideEnGrupos === "Sin clases" ? "AServicio" : "AGrupo",
      claseDePrueba: data.clasePrueba === "sí" ? true : false,
      asistenciasActivas: data.asistencias === "sí" ? true : false,
      montoInscripcion: data.montoInscripcion || 0,
      pagoAnticipadoDeMontoInscripcion:
        data.pagoInscripcion === "De forma Anticipada",
      logo: data.logo[0],
      modalidadClases: data.modalidadClases.includes("virtual") && data.modalidadClases.includes("presencial")
        ? "Hibrida"
        : data.modalidadClases.includes("virtual")
          ? "Virtual"
          : "Presencial"
    };

    console.log("ServicioDTO", servicioDTO);

    try {
      const response = await createServicio(servicioDTO);
      //alert("Servicio creado con éxito");
      setShowSuccessModal(true);

      navigate(
        `/instructor/${idInstructor}/servicio/${response.id}/configurar`,
        { state: { from: window.location.pathname } }
      );
    } catch (error) {
      console.error("Error al crear el servicio:", error);
      alert("Hubo un problema al crear el servicio.");
    }
  };

  const goToNextTab = () => {
    if (activeTab === "general") setActiveTab("cobros");
    else if (activeTab === "cobros") setActiveTab("modalidad");
  };

  const goToPreviousTab = () => {
    if (activeTab === "cobros") setActiveTab("general");
    else if (activeTab === "modalidad") setActiveTab("cobros");
  };

  const handleCancel = () => {
    navigate(-1, { state: { from: window.location.pathname } });
  };

  return (
    <div
    style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "10px",
      marginTop: "15vh",
      fontFamily: "Roboto",
      overflowX: "hidden", // Evita la barra de desplazamiento horizontal
      width: "100vw" // Asegura que el contenido no sobrepase el ancho de la pantalla
    }}
      className="d-flex flex-column flex-md-row align-item-center"
    >
      {/* Columna Izquierda (Formulario) */}
      <div
        style={{
          flex: 1,
          padding:"3px"
        }}
        className="col-11 col-md-12"
      >
        <div className="col-md-12 col-sm-12 p-4">
          <h1 className="mb-1 text-center fs-1 mb-4">Agregar Servicio</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card shadow-lg rounded-3 bg-light p-4"
            style={{ height: "100%" }}
          >
            <Tabs
              id="register-tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
            >
              <Tab eventKey="general" title="General">
                {/* Se pasan también logoPreview y setLogoPreview */}
                <General
                  register={register}
                  errors={errors}
                  categorias={categorias}
                  goToNextTab={goToNextTab}
                  logoPreview={logoPreview}
                  setLogoPreview={setLogoPreview}
                />
              </Tab>

              <Tab eventKey="cobros" title="Cobros">
                <Cobros
                  register={register}
                  errors={errors}
                  formData={formData}
                  goToNextTab={goToNextTab}
                  goToPreviousTab={goToPreviousTab}
                  setValue={setValue}
                  watch={watch}
                />
              </Tab>

              <Tab eventKey="modalidad" title="Modalidad">
                <Modalidad
                  register={register}
                  errors={errors}
                  formData={formData}
                  goToPreviousTab={goToPreviousTab}
                  isValid={isValid}
                  nombreBoton={"Registrar"}
                />
              </Tab>
            </Tabs>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCancel}>
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                style={{ marginLeft: "2vh" }}
              >
                Registrar
              </Button>
            </div>

          </form>
        </div>
      </div>

      {/* Columna Derecha (ResumenServicio) */}
      <div
        style={{
          flex: 1,
          maxWidth: "80vh", // Ancho máximo de la card
        }}
        className="col-11 col-md-6 col-lg-11 mt-4 mt-md-0 mb-3 p-3"
      >
        <ResumenServicio formData={formData} />
      </div>

      {/* Success Modal reutilizable */}
      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={"Servicio creado con éxito"}
        message={""}
      />
    </div>
  );
}
