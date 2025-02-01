import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCategorias } from "../../../services/Categoria";
import { createServicio } from "../../../services/Servicio";
import General from "./Tabs/General";
import Cobros from "./Tabs/Cobros";
import Modalidad from "./Tabs/Modalidad";
import ResumenServicio from "./Tabs/InfoCard";
import { Tab, Tabs, Button } from "react-bootstrap";


export default function ServicioForm() {
  const [activeTab, setActiveTab] = useState("general");
  const [categorias, setCategorias] = useState([]);
  const { idInstructor } = useParams();
  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: "onChange", // Ensure validation triggers on change
    defaultValues: {
      nombreServicio: '',
      descripcion: '',
      ubicacion: '',
      categoria: '',
      frecuenciaCuotas: '',
      clasePrueba: '',
      asistencia: '',
      montoInscripcion: 0,
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
 
      case "OTROS":
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
    const ciclo = obtenerValoresCiclo( data.frecuenciaCuotas,data.duracionCuotasPersonalizada);
    const servicioDTO = {
      nombre: data.nombreServicio,
      idInstructor: idInstructor,
      descripcion: data.descripcion,
      ubicacion: data.ubicacion,
      categoria: data.categoria,
      tipoCiclo:
        data.ciclos === "Mismas Fechas"
          ? "SegunCalendario"
          : "SegunInscripcion",
      diaLimitePago:
        data.frecuenciaCuotas === "mensual" ? data.fechaLimitePago : null,
      cantCiclo: ciclo.cantidad,
      unidadCiclo: ciclo.unidad,
      tipoModalidad:
        data.divideEnGrupos === "Sin clases" ? "AServicio" : "AGrupo",
      claseDePrueba: data.clasePrueba === "sí" ? true : false,
      asistenciasActivas: data.asistencias === "sí" ? true : false,
      montoInscripcion: data.montoInscripcion || 0,
      pagoAnticipadoDeMontoInscripcion:
        data.pagoInscripcion === "De forma Anticipada",
    };


    try {
      const response = await createServicio(servicioDTO);
      alert("Servicio creado con éxito");
      navigate(
        `/instructor/${idInstructor}/servicio/${response.id}/info-servicio`
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


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        fontFamily: "Roboto",
        flexWrap: "wrap",
        marginTop: "10vh"
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
        className="col-12 col-md-12"
      >
        <div className="col-md-12 col-sm-12 p-4">
          <h1 className="mb-1 text-center fs-1 mb-4">Agregar Servicio</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card shadow-lg rounded-3 bg-light p-4"
          >
            <Tabs
              id="register-tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
            >
              <Tab eventKey="general" title="General">
                <General
                  register={register}
                  errors={errors}
                  categorias={categorias}
                  goToNextTab={goToNextTab}
                />
              </Tab>


              <Tab eventKey="cobros" title="Cobros">
                <Cobros
                  register={register}
                  errors={errors}
                  formData={formData}
                  goToNextTab={goToNextTab}
                  goToPreviousTab={goToPreviousTab}
                />
              </Tab>


              <Tab eventKey="modalidad"  title="Modalidad">
                <Modalidad
                  register={register}
                  errors={errors}
                  formData={formData}
                  goToPreviousTab={goToPreviousTab}
                  isValid={isValid}
                />
              </Tab>
            </Tabs>


          </form>
        </div>
      </div>


      {/* Columna Derecha (ResumenServicio) */}
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
        <ResumenServicio formData={formData} />
      </div>
    </div>
  );
}