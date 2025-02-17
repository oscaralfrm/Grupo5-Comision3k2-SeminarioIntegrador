import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, Button } from "react-bootstrap";
import General from "../Servicio/Tabs/General";
import Cobros from "../Servicio/Tabs/Cobros";
import Modalidad from "../Servicio/Tabs/Modalidad";
import ResumenServicio from "../Servicio/Tabs/InfoCard";
import { getServicioById, updateServicio } from "../../../services/Servicio";
import { getAllCategorias } from "../../../services/Categoria";

export default function EditServicioForm() {
    const [activeTab, setActiveTab] = useState("general");
    const [categorias, setCategorias] = useState([]);
    // Estado para la vista previa del logo
    const [logoPreview, setLogoPreview] = useState("");
    const { idInstructor, idServicio } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
    } = useForm({
        mode: "onChange",
    });

    const formData = watch();

    const handleCancel = () => {
        navigate(-1, { state: { from: window.location.pathname } });
    };

    useEffect(() => {
        const fetchServicio = async () => {
            try {
                const response1 = await getAllCategorias();
                setCategorias(response1);

                const response = await getServicioById(idServicio);
                const frecuenciaCuotasObj = obtenerFrecuenciaCuotas(
                    response.tipoFrecuenciaPago.cantCiclo,
                    response.tipoFrecuenciaPago.unidadCiclo
                );

                setValue("nombreServicio", response.nombre);
                setValue("descripcion", response.descripcion);
                // Establecemos el valor inicial del logo como la URL que llega del backend
                //setValue("logo", response.logoURL);
                setLogoPreview(response.logoURL);
                setValue("ubicacion", response.ubicacion);
                setValue("categoria", response.categoria.nombre);
                setValue("frecuenciaCuotas", frecuenciaCuotasObj.frecuenciaCuotas);
                setValue("duracionCuotasPersonalizada", frecuenciaCuotasObj.duracionCuotasPersonalizada);
                setValue("clasePrueba", response.claseDePrueba ? "sí" : "no");
                setValue("asistencias", response.asistenciasActivas ? "sí" : "no");
                setValue("incluyeInscripcion", response.montoInscripcion > 0 ? "si" : "no");
                setValue("montoInscripcion", response.montoInscripcion);
                setValue("pagoInscripcion", response.pagoAnticipadoDeMontoInscripcion ? "anticipado" : "incluido en la cuota");
                if (response.tipoFrecuenciaPago.diaLimitePago > 0) {
                    setValue("fechaLimitePago", response.tipoFrecuenciaPago.diaLimitePago);
                }
                setValue("ciclos", response.tipoFrecuenciaPago.tipoCiclo === "SegunCalendario" ? "En fechas fijas" : "Según Inscripción");
                setValue("modalidadClases", 
                    response.modalidadClases === "Virtual" 
                        ? ["virtual"]
                        : response.modalidadClases === "Presencial" 
                            ? ["presencial"]
                            : ["virtual", "presencial"] );
            } catch (error) {
                console.error("Error al obtener el servicio:", error);
            }
        };

        fetchServicio();
    }, [idServicio, setValue]);

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

    function obtenerFrecuenciaCuotas(cantidad, unidad) {
        if (cantidad === 1) {
            switch (unidad) {
                case "MONTHS":
                    return { frecuenciaCuotas: "mensual", duracionCuotasPersonalizada: null };
                case "WEEKS":
                    return { frecuenciaCuotas: "semanal", duracionCuotasPersonalizada: null };
                case "DAYS":
                    return { frecuenciaCuotas: "diaria", duracionCuotasPersonalizada: null };
            }
        } else {
            switch (unidad) {
                case "MONTHS":
                    return { frecuenciaCuotas: "otros", duracionCuotasPersonalizada: cantidad * 30 };
                case "WEEKS":
                    return { frecuenciaCuotas: "otros", duracionCuotasPersonalizada: cantidad * 7 };
                case "DAYS":
                    return { frecuenciaCuotas: "otros", duracionCuotasPersonalizada: cantidad };
            }
        }
    }

    const onSubmit = async (data) => {
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
            claseDePrueba: data.clasePrueba === "sí",
            asistenciasActivas: data.asistencias === "sí",
            montoInscripcion: data.montoInscripcion || 0,
            pagoAnticipadoDeMontoInscripcion: data.pagoInscripcion === "De forma Anticipada",
            modalidadClases: data.modalidadClases.includes("virtual") && data.modalidadClases.includes("presencial")
                ? "Hibrida"
                : data.modalidadClases.includes("virtual")
                    ? "Virtual"
                    : "Presencial"

        };

        // Si el usuario seleccionó un nuevo archivo, data.logo vendrá como FileList
        if (data.logo && data.logo.length > 0 && data.logo[0] instanceof File) {
            servicioDTO.logo = data.logo[0];
        }

        try {
            const response = await updateServicio(idServicio, servicioDTO);
            alert("Servicio editado con éxito");
            navigate(`/instructor/${idInstructor}/servicio/${response.id}/configurar`);
        } catch (error) {
            console.error("Error al editar el servicio:", error);
            alert("Hubo un problema al editar el servicio.");
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
        <div style={{ display: "flex", flexDirection: "row", fontFamily: "Roboto", flexWrap: "wrap", marginTop: "8vh" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }} className="col-12 col-md-12">
                <div className="col-md-12 col-sm-12 p-4">
                    <h1 className="mb-1 text-center fs-1 mb-4">Editar Servicio</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="card shadow-lg rounded-3 bg-light p-4">
                        <Tabs id="register-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                            <Tab eventKey="general" title="General">
                                {/* Se le pasan logoPreview y setLogoPreview */}
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
                                />
                            </Tab>
                            <Tab eventKey="modalidad" title="Modalidad">
                                <Modalidad
                                    register={register}
                                    errors={errors}
                                    formData={formData}
                                    goToPreviousTab={goToPreviousTab}
                                    isValid={isValid}
                                    nombreBoton={"Editar"}
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
                                style={{marginLeft: "2vh"}}
                            >
                                Editar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <div
                style={{
                    flex: 1,
                    // padding: "20px",
                    // display: "flex",
                    // flexDirection: "column",
                    // alignItems: "center",
                    // minHeight: "calc(100vh - 290px)",
                    justifyContent: "center",
                }}
                className="d-flex flex-column flex-md-row align-item-center"
            >
                {Object.keys(formData).length > 0 && <ResumenServicio formData={formData} />}
            </div>
        </div>
    );
}
