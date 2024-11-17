import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Tab,
  Tabs,
  Card,
  Form,
  Col,
  Row,
  Image,
} from "react-bootstrap";
import { useNavigate , useLocation, useParams } from "react-router-dom";
import {getAllCategorias} from "../../../services/Categoria.js"
import {createServicio} from "../../../services/Servicio.js"

const ServicioForm = () => {
  const [activeTab, setActiveTab] = useState("general");
  const {idInstructor} = useParams();
  const navegate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({ mode: "onChange" });
  //const formData = watch();
  //const incluyeInscripcion = watch("incluyeInscripcion");
  //const frecuenciaCuotas = watch("frecuenciaCuotas");
  //const divideEnGrupos = watch("divideEnGrupos");
  const formData = watch();

  //const handleRegister = (() =>{navegate("/instructor/1/servicio/1/mi-servicio")});
  // Actualiza el estado inicial con serviceData solo al montar el componente

  const [categorias, setCategorias] = useState([]); // Estado para las categorías

  useEffect(() => {
    // Llama al servicio para obtener las categorías
    const fetchCategorias = async () => {
      try {
        const response = await getAllCategorias(); // Asume que esto retorna un array
        setCategorias(response); // Ajusta según la estructura de tu respuesta
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategorias();
  }, []); // Ejecuta al montar el componente

  const onSubmit = async (data) => {

    // Transforma formData al formato esperado por el backend
    const servicioDTO = {
      nombre: data.nombreServicio,
      descripcion: data.descripcion,
      //logoURL: data.logo ? URL.createObjectURL(data.logo) : null,
      ubicacion: data.ubicacion,
      categoria: data.categoria,
      frecuenciaPagoId: data.frecuenciaCuotas === "mensual" ? (data.ciclos === "Mismas Fechas" ? 1 : 2 ) : null, // PROVISORIOOOO "A mes calendario"
      diaLimitePago: data.frecuenciaCuotas === "mensual" ? data.fechaLimitePago : null,
      cantDiasCiclo: data.frecuenciaCuotas === "otros" ? data.duracionCuotasPersonalizada : null,
      cantMaxAlumnosPorGrupo: (data.divideEnGrupos === "Grupales" || data.divideEnGrupos === "Individuales y grupales" ) ? data.cupoMaximoAlumnos : (data.divideEnGrupos === "Individuales" ? 1 : null),
      tipoModalidad: data.divideEnGrupos === "Sin clases" ? "AServicio" : "AGrupo",
      fechaInicio: null, // Puedes ajustar según la lógica
      duracionTotalMeses: null,
      publico: false, // Por defecto
      claseDePrueba: false, // Por defecto
      asistenciasActivas: data.asistencias === "Sí" ? true : false, // Por defecto
      montoInscripcion: data.montoInscripcion || 0,
      pagoAnticipadoDeMontoInscripcion: data.pagoInscripcion === "De forma Anticipada" ? true : false,
    };
    console.log("data", servicioDTO);

    try {
      const response = await createServicio(servicioDTO);
      alert("Servicio creado con éxito");
      navegate(`/instructor/${idInstructor}/servicio/${response.id}/mi-servicio`)
    } catch (error) {
      console.error("Error al crear el servicio:", error.response.message || "Error inesperado");
      alert("Hubo un problema al crear el servicio.");
    }
  };

  const goToNextTab = () => {
    if (activeTab === "general") {
      setActiveTab("cobros");
    } else if (activeTab === "cobros") {
      setActiveTab("modalidad");
    }
  };

  const goToPreviousTab = () => {
    if (activeTab === "cobros") {
      setActiveTab("general");
    } else if (activeTab === "modalidad") {
      setActiveTab("cobros");
    }
  };

  return (
    <div style={{ fontFamily: "Roboto, sans-serif" }}>
      <Row className="m-3">
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <Card className="shadow-sm rounded" style={{ border: "none" }}>
            <Card.Header
              className="fs-3 text-center text-white rounded-top"
              style={{ backgroundColor: "#1E1B4B", boxShadow: "0 10px 12px rgba(0, 0, 0, 0.1)" }}
            >
              Registrar Servicio
            </Card.Header>
            <Card.Body className="p-4" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)" }}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                {/* General Tab */}
                <Tab eventKey="general" title="General">
                  <Form.Group controlId="categoria">
                      <Form.Label className="fw-semibold">Categoría</Form.Label>
                      <Form.Control
                        as="select"
                        {...register("categoria", 
                          {  required: "Selecciona una categoría" })}
                      >
                        <option value="">Selecciona una categoría</option>
                        {categorias && categorias.map((cat) => (
                          <option key={cat.id} value={cat.nombre}>
                            {cat.nombre}
                          </option>
                        ))}
                      </Form.Control>
                      {errors.categoria && <p className="text-danger">{errors.categoria.message}</p>}
                    </Form.Group>

                    <Form.Group controlId="nombreServicio" className="mt-3">
                      <Form.Label className="fw-semibold">
                        Nombre del Servicio
                      </Form.Label>
                      <Form.Control
                        type="text"
                        {...register("nombreServicio", {  required: "El nombre es obligatorio" })}
                      />
                      {errors.nombreServicio && <p className="text-danger">{errors.nombreServicio.message}</p>}
                    </Form.Group>

                    <Form.Group controlId="descripcion" className="mt-3">
                      <Form.Label className="fw-semibold">
                        Descripción
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="descripcion"
                        placeholder="Ej: En los encuentros se relizarán actividades en las que podrás experimentar y aprender..."
                        {...register("descripcion" )}
                      />
                    </Form.Group>

                    <Form.Group controlId="ubicacion" className="mt-3">
                      <Form.Label className="fw-semibold">Ubicación</Form.Label>
                      <Form.Control
                        type="text"
                        name="ubicacion"
                        {...register("ubicacion") }
                      />
                    </Form.Group>

                    <Form.Group controlId="logo" className="mt-3">
                      <Form.Label className="fw-semibold">Logo</Form.Label>
                      <Form.Control
                        type="file"
                        {...register("logo" )}
                      />
                    </Form.Group>
                  
                  <div
                    className="d-flex justify-content-end align-items-center"
                    style={{ cursor: "pointer", margin: 0, padding: 0 }}
                    onClick={goToNextTab}
                  >
                    <span className="fs-3" style={{ margin: 0, padding: 0 }}>
                      &#8594;
                    </span>
                  </div>
                </Tab>

                {/* Modalidad Tab */}
                <Tab eventKey="cobros" title="Cobros">
                    {/* Frecuencia de Cuotas */}
                    <Form.Group controlId="frecuenciaCuotas" className="mt-3">
                      <Form.Label className="fw-semibold">¿Con qué frecuencia se realizará el cobro?</Form.Label>
                      {["Diaria", "Semanal", "Mensual", "Otros"].map((freq) => (
                        <Form.Check
                          key={freq}
                          type="radio"
                          label={freq}
                          value={freq.toLowerCase()}
                          {...register("frecuenciaCuotas", {
                            required: "Debes seleccionar una opción."
                          })}
                        />
                      ))}
                      {errors.frecuenciaCuotas && (
                          <p className="text-danger">{errors.frecuenciaCuotas.message}</p>
                      )}

                      {formData.frecuenciaCuotas === "otros" && (
                        <Form.Group controlId="duracionCuotasPersonalizada" className="mt-3">
                          <Form.Label className="fw-semibold">Frecuencia de cobro en días</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Ej: 45 días"
                            {...register("duracionCuotasPersonalizada", {
                              required: "Debes seleccionar una opción."
                            })}
                          />
                        </Form.Group>
                      )}
                    </Form.Group>

                    {/* Segun fecha de inscripcion o A mes calendario */}
                    <Form.Group controlId="ciclos" className="mt-3">
                      <Form.Label className="fw-semibold">¿Tus alumnos podrán abonar en las mismas fechas o según su inscripción?</Form.Label>
                      <Form.Check
                        type="radio"
                        label="Mismas Fechas"
                        value="Mismas Fechas"
                        {...register("ciclos", { required: "Debes seleccionar una opción." })} // Aquí agregamos el registro
                      />
                      <Form.Check
                        type="radio"
                        label="Según Inscripcion"
                        value="Segun Inscripcion"
                        {...register("ciclos", { required: "Debes seleccionar una opción." })} // Aquí agregamos el registro
                      />
                      {errors.ciclos && (
                        <p className="text-danger">{errors.ciclos.message}</p> // Muestra el error si no se selecciona nada
                      )}
                    </Form.Group>


                    {/* Fecha límite de pago */}
                    <Form.Group controlId="fechaLimitePago" className="mt-3">
                      <Form.Label className="fw-semibold">
                        Dia límite de pago (X días desde el inicio del ciclo)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="fechaLimitePago"
                        placeholder=""
                        {...register("fechaLimitePago", {
                          validate: (value) =>
                            !value || value > 0 || "El día límite debe ser mayor a 0",
                        })}
                      />
                       {errors.fechaLimitePago && (
                        <p className="text-danger">{errors.fechaLimitePago.message}</p> // Muestra el error si no se selecciona nada
                      )}
                    </Form.Group>

 {/* Incluye Inscripción */}
 <Form.Group controlId="incluyeInscripcion" className="mt-3">
        <Form.Label className="fw-semibold">¿Incluye un monto de inscripción?</Form.Label>
        <Form.Check
          type="radio"
          label="No incluye"
          value="no"
          {...register("incluyeInscripcion", { required: "Debes seleccionar una opción." })}
        />
        <Form.Check
          type="radio"
          label="Incluye"
          value="si"
          {...register("incluyeInscripcion", { required: "Debes seleccionar una opción." })}
        />
        {errors.incluyeInscripcion && (
          <p className="text-danger">{errors.incluyeInscripcion.message}</p>
        )}
      </Form.Group>

      {/* Monto de inscripción */}
      {formData.incluyeInscripcion === "si" && (
        <>
          <Form.Group controlId="montoInscripcion" className="mt-3">
            <Form.Label className="fw-semibold">Monto por la inscripción</Form.Label>
            <Form.Control
              type="number"
              placeholder="$X"
              {...register("montoInscripcion", {
                required: "El monto es obligatorio.",
                valueAsNumber: true,
                validate: (value) => value > 0 || "El monto debe ser mayor a 0.",
              })}
            />
            {errors.montoInscripcion && (
              <p className="text-danger">{errors.montoInscripcion.message}</p>
            )}
          </Form.Group>

          {/* Pago de inscripción */}
          <Form.Group controlId="pagoInscripcion" className="mt-3">
            <Form.Label className="fw-semibold">La inscripción se paga:</Form.Label>
            {["Incluido en la Primera Cuota", "De forma Anticipada"].map((opcion) => (
              <Form.Check
                key={opcion}
                type="radio"
                label={opcion}
                value={opcion.toLowerCase()}
                {...register("pagoInscripcion", {
                  required: "Selecciona cómo se paga la inscripción.",
                })}
              />
            ))}
            {errors.pagoInscripcion && (
              <p className="text-danger">{errors.pagoInscripcion.message}</p>
            )}
          </Form.Group>
        </>
      )}
                  
                  <div className="d-flex justify-content-between">
                    <span className="fs-3" onClick={goToPreviousTab} style={{ cursor: "pointer" }}>
                      &#8592;
                    </span>
                    <span className="fs-3" style={{ cursor: "pointer" }} onClick={goToNextTab}>
                      &#8594;
                    </span>
                  </div>
                </Tab>

              {/* Resumen del Servicio */}
              <Tab eventKey="modalidad" title="Modalidad">
                {/* División en Grupos */}
                <Form.Group controlId="divideEnGrupos" className="mt-3">
                      <Form.Label className="fw-semibold">¿Cómo son tus clases?</Form.Label>
                      <Form.Check
                        type="radio"
                        name="divideEnGrupos"
                        label="Individuales"
                        value="Individuales"
                        {...register("divideEnGrupos", { required: "Debes seleccionar una opción." })} // Registrar la opción 'Sí'
                      />
                      <Form.Check
                        type="radio"
                        name="divideEnGrupos"
                        label="Grupales"
                        value="Grupales"
                        {...register("divideEnGrupos", { required: "Debes seleccionar una opción." })} // Registrar la opción 'Sí'
                      />
                      <Form.Check
                        type="radio"
                        name="divideEnGrupos"
                        label="Individuales y grupales"
                        value="Individuales y grupales"
                        {...register("divideEnGrupos", { required: "Debes seleccionar una opción." })} // Registrar la opción 'Sí'
                      />
                      <Form.Check
                        type="radio"
                        name="divideEnGrupos"
                        label="No doy clases"
                        value="Sin clases"
                        {...register("divideEnGrupos", { required: "Debes seleccionar una opción." })} // Registrar la opción 'Sí'
                      />
                      {errors.divideEnGrupos && (
                        <p className="text-danger">{errors.divideEnGrupos.message}</p> // Mensaje de error si no se selecciona nada
                      )}
                    </Form.Group>

                    {/* Cupo máximo de alumnos */}
                    { (formData.divideEnGrupos === "Grupales" || formData.divideEnGrupos === "Individuales y grupales" ) && (
                      <Form.Group controlId="cupoMaximoAlumnos" className="mt-3">
                        <Form.Label className="fw-semibold">Cupo máximo de alumnos por grupo</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Ej: 20"
                          {...register("cupoMaximoAlumnos", {
                            required: ( formData.divideEnGrupos === "Grupales" || formData.divideEnGrupos === "Individuales y grupales" ) 
                            ? "Este campo es obligatorio." : false,
                            min: { value: 1, message: "El cupo debe ser al menos 1." },
                          })} // Registrar campo de cupo máximo con validación
                        />
                        {errors.cupoMaximoAlumnos && (
                        <p className="text-danger">{errors.cupoMaximoAlumnos.message}</p> // Mensaje de error si no es válido
                        )}
                      </Form.Group>
                    )}

                  {/* Asistencias */}
                  { ( formData.divideEnGrupos != "Sin clases" ) && (
                    <Form.Group controlId="asistencias" className="mt-3">
                      <Form.Label className="fw-semibold">¿Quieres registrar las asistencias de tus alumnos?</Form.Label>
                      <Form.Check
                        type="radio"
                        name="asistencias"
                        label="Sí"
                        value="si"
                        {...register("asistencias", { required: "Debes seleccionar una opción." })} // Registrar la opción 'Sí'
                      />
                      <Form.Check
                        type="radio"
                        name="asistencias"
                        label="No"
                        value="no"
                        {...register("asistencias", { required: "Debes seleccionar una opción." })} // Registrar la opción 'Sí'
                      />
                      {errors.asistencias && (
                        <p className="text-danger">{errors.asistencias.message}</p> // Mensaje de error si no se selecciona nada
                      )}
                    </Form.Group>
                  )}

                  {/* Clase prueba */}
                  { ( formData.divideEnGrupos != "Sin clases" ) && (
                    <Form.Group controlId="clasePrueba" className="mt-3">
                      <Form.Label className="fw-semibold">¿Ofreces clase de prueba gratuita?</Form.Label>
                      <Form.Check
                        type="radio"
                        name="clasePrueba"
                        label="Sí"
                        value="si"
                        {...register("clasePrueba", { required: "Debes seleccionar una opción." })} // Registrar la opción 'Sí'
                      />
                      <Form.Check
                        type="radio"
                        name="clasePrueba"
                        label="No"
                        value="no"
                        {...register("clasePrueba", { required: "Debes seleccionar una opción." })} // Registrar la opción 'Sí'
                      />
                      {errors.clasePrueba && (
                        <p className="text-danger">{errors.clasePrueba.message}</p> // Mensaje de error si no se selecciona nada
                      )}
                    </Form.Group>
                  )}


                   
                  <div className="d-flex justify-content-between">
                    <span className="fs-3" onClick={goToPreviousTab} style={{ cursor: "pointer" }}>
                      &#8592;
                    </span>
                  </div>
              </Tab>


              </Tabs>
              <button
                        type="submit" // Cambiado a "button" para evitar submit del formulario completo
                        className="btn btn-primary"
                        // Deshabilitar si el formulario no es válido
                        style={{ marginLeft: "auto" }}
                        disabled={!isValid} // Deshabilitar si el formulario no es válido
                      >
                        Crear
                      </button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        {/* Resumen del Servicio */}
        <Col xs={12} md={4} className="mt-4 mt-md-0">
          <Card className="shadow-lg rounded-3 border-0" style={{ backgroundColor: "white" }}>
            <Card.Header className="fs-4 fw-semibold text-center text-white rounded-top-3" style={{ backgroundColor: '#1E1B4B' }}>
              Resumen del Servicio
            </Card.Header>
            <Card.Body className="text-left">
              <p>Categoría: {formData.categoria }</p>
              <p>Nombre: {formData.nombreServicio }</p>
              <p>Frecuencia de pago: {formData.frecuenciaCuotas }</p>
              <p>Ciclos de alumnos: {formData.ciclos }</p>
              <p>Dia límite de pago: {formData.fechaLimitePago }</p>
              <p>Incluye cobro de inscripción: {(formData.incluyeInscripcion) }</p>
              {formData.incluyeInscripcion === "si" ? (<> <p> Monto por la inscripción: {formData.montoInscripcion} </p>
              <p> La inscripción se paga: {formData.pagoInscripcion} </p>
                </>)
              :(<p></p>)}
              <p>Clases: {formData.divideEnGrupos }</p>
              { (formData.divideEnGrupos == "Grupales" || formData.divideEnGrupos == "Individuales y grupales" ) 
                    ? <p>Cantidad máxima por grupo: {formData.cupoMaximoAlumnos} </p>
                    :<p></p>}
              { (formData.divideEnGrupos != "Sin clases" ) 
              ? <div><p>Asistencias: {formData.asistencias }</p>
              <p>Clase prueba gratuita: {formData.clasePrueba }</p></div>
               :<p></p>}
              
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </div>
  );
};

export default ServicioForm;