import React, { useState, useEffect } from "react";
import {
  Tab,
  Tabs,
  Card,
  Form,
  Col,
  Row,
  Image,
} from "react-bootstrap";
import { useNavigate , useLocation } from "react-router-dom";

const ServicioForm = () => {
  const [activeTab, setActiveTab] = useState("general");
  const location = useLocation();
  const navegate = useNavigate();
  const serviceData = location.state || {};

  const [formData, setFormData] = useState({
    categoria: "",
    nombreServicio: "",
    descripcion: "",
    ubicacion: "",
    logo: null,
    frecuenciaCuotas: "",
    duracionCuotasPersonalizada: "",
    fechaLimitePago: "",
    divideEnGrupos: "",
    cupoMaximoAlumnos: "",
    incluyeInscripcion: false,
    montoInscripcion: "",
    pagoInscripcion: "",
    cantidadDiasSemana: "",
    montoPorSemana: "",
  });
  const handleRegister = (() =>{navegate("/instructor/1/servicio/1/mi-servicio")});
  // Actualiza el estado inicial con serviceData solo al montar el componente
  useEffect(() => {
    if (serviceData) {
      setFormData((prevData) => ({
        ...prevData,
        categoria: serviceData.categoria || "",
        nombreServicio: serviceData.nombreServicio || "",
        descripcion: serviceData.descripcion || "",
        ubicacion: serviceData.ubicacion || "",
        logo: serviceData.logo || null,
      }));
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const goToNextTab = () => {
    if (activeTab === "general") {
      setActiveTab("modalidad");
    } else if (activeTab === "modalidad") {
      setActiveTab("monto");
    }
  };

  const goToPreviousTab = () => {
    if (activeTab === "modalidad") {
      setActiveTab("general");
    } else if (activeTab === "monto") {
      setActiveTab("modalidad");
    }
  };

  // Verificación de validez del formulario
  const isValid = Object.values(formData).every(
    (field) => field !== "" && field !== null
  );

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
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                {/* General Tab */}
                <Tab eventKey="general" title="General">
                  <Form>
                    <Form.Group controlId="categoria">
                      <Form.Label className="fw-semibold">Categoría</Form.Label>
                      <Form.Control
                        as="select"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                      >
                        <option value="">Selecciona una categoría</option>
                        <option value="idiomas">Idiomas</option>
                        <option value="danza">Danza</option>
                        <option value="musica">Música</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="nombreServicio" className="mt-3">
                      <Form.Label className="fw-semibold">
                        Nombre del Servicio
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="nombreServicio"
                        value={formData.nombreServicio}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="descripcion" className="mt-3">
                      <Form.Label className="fw-semibold">
                        Descripción
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="ubicacion" className="mt-3">
                      <Form.Label className="fw-semibold">Ubicación</Form.Label>
                      <Form.Control
                        type="text"
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="logo" className="mt-3">
                      <Form.Label className="fw-semibold">Logo</Form.Label>
                      <Form.Control
                        type="file"
                        name="logo"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Form>
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
                <Tab eventKey="modalidad" title="Modalidad">
                  <Form>
                    {/* Frecuencia de Cuotas */}
                    <Form.Group controlId="frecuenciaCuotas" className="mt-3">
                      <Form.Label className="fw-semibold">¿Con qué frecuencia se realizará el cobro?</Form.Label>
                      {["Diaria", "Semanal", "Mensual", "Otros"].map((freq) => (
                        <Form.Check
                          key={freq}
                          type="radio"
                          name="frecuenciaCuotas"
                          label={freq}
                          value={freq.toLowerCase()}
                          checked={formData.frecuenciaCuotas === freq.toLowerCase()}
                          onChange={handleInputChange}
                        />
                      ))}
                      {formData.frecuenciaCuotas === "otros" && (
                        <Form.Group controlId="duracionCuotasPersonalizada" className="mt-3">
                          <Form.Label className="fw-semibold">Frecuencia de cobro en días</Form.Label>
                          <Form.Control
                            type="number"
                            name="duracionCuotasPersonalizada"
                            placeholder="Ej: 45 días"
                            value={formData.duracionCuotasPersonalizada || ""}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      )}
                    </Form.Group>


                    {/* Fecha límite de pago */}
                    <Form.Group controlId="fechaLimitePago" className="mt-3">
                      <Form.Label className="fw-semibold">
                        Fecha límite de pago (X días desde el inicio del ciclo)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="fechaLimitePago"
                        placeholder=""
                        value={formData.fechaLimitePago || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    {/* División en Grupos */}
                    <Form.Group controlId="divideEnGrupos" className="mt-3">
                      <Form.Label className="fw-semibold">¿Querés dividir tu servicio en grupos?</Form.Label>
                      <Form.Check
                        type="radio"
                        name="divideEnGrupos"
                        label="Sí"
                        value="si"
                        checked={formData.divideEnGrupos === "si"}
                        onChange={handleInputChange}
                      />
                      <Form.Check
                        type="radio"
                        name="divideEnGrupos"
                        label="No"
                        value="no"
                        checked={formData.divideEnGrupos === "no"}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    {/* Cupo máximo de alumnos */}
                    {formData.divideEnGrupos === "si" && (
                      <Form.Group controlId="cupoMaximoAlumnos" className="mt-3">
                        <Form.Label className="fw-semibold">Cupo máximo de alumnos por grupo</Form.Label>
                        <Form.Control
                          type="number"
                          name="cupoMaximoAlumnos"
                          placeholder="Ej: 20"
                          value={formData.cupoMaximoAlumnos || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    )}

                    {/* Incluye Inscripción */}
                    <Form.Group controlId="incluyeInscripcion" className="mt-3">
                      <Form.Check
                        type="checkbox"
                        name="incluyeInscripcion"
                        label="¿Incluye un cobro la inscripción?"
                        checked={formData.incluyeInscripcion || false}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    {/* Monto de inscripción */}
                    {formData.incluyeInscripcion && (
                      <Form.Group controlId="montoInscripcion" className="mt-3">
                        <Form.Label className="fw-semibold">Monto por la inscripción</Form.Label>
                        <Form.Control
                          type="number"
                          name="montoInscripcion"
                          placeholder="$X"
                          value={formData.montoInscripcion || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    )}

                    {/* Pago de inscripción */}
                    {formData.incluyeInscripcion && (
                      <Form.Group controlId="pagoInscripcion" className="mt-3">
                        <Form.Label className="fw-semibold">La inscripción se paga:</Form.Label>
                        {["Incluido en la Primera Cuota", "De forma Anticipada"].map((opcion) => (
                          <Form.Check
                            key={opcion}
                            type="radio"
                            name="pagoInscripcion"
                            label={opcion}
                            value={opcion.toLowerCase()}
                            checked={formData.pagoInscripcion === opcion.toLowerCase()}
                            onChange={handleInputChange}
                          />
                        ))}
                      </Form.Group>
                    )}
                  </Form>
                  <div className="d-flex justify-content-between">
                    <span className="fs-3" onClick={goToPreviousTab} style={{ cursor: "pointer" }}>
                      &#8592;
                    </span>
                    <span className="fs-3" style={{ cursor: "pointer" }} onClick={goToNextTab}>
                      &#8594;
                    </span>
                  </div>
                </Tab>

                {/* Monto Tab */}
                <Tab eventKey="monto" title="Monto">
                  <Form>
                    {/* Cantidad de días por semana */}
                    <Form.Group controlId="cantidadDiasSemana" className="mt-3">
                      <Form.Label className="fw-semibold">Cantidad de días por semana</Form.Label>
                      <Form.Control
                        type="number"
                        name="cantidadDiasSemana"
                        placeholder="Ej: 3"
                        value={formData.cantidadDiasSemana || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    {/* Monto correspondiente */}
                    <Form.Group controlId="montoPorSemana" className="mt-3">
                      <Form.Label className="fw-semibold">Monto correspondiente por semana</Form.Label>
                      <Form.Control
                        type="number"
                        name="montoPorSemana"
                        placeholder="Ej: 500"
                        value={formData.montoPorSemana || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    {/* Botones de navegación */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="fs-3" onClick={goToPreviousTab} style={{ cursor: "pointer" }}>
                        &#8592;
                      </span>
                      <button
                        type="button" // Cambiado a "button" para evitar submit del formulario completo
                        className="btn btn-primary"
                        // Deshabilitar si el formulario no es válido
                        style={{ marginLeft: "auto" }}
                        onClick={handleRegister} // Llama a la función de navegación
                      >
                        Regístrate
                      </button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        {/* Resumen del Servicio */}
        <Col xs={12} md={4} className="mt-4 mt-md-0">
          <Card className="shadow-lg rounded-3 border-0" style={{ backgroundColor: "white" }}>
            <Card.Header className="fs-4 fw-semibold text-center text-white rounded-top-3" style={{ backgroundColor: '#1E1B4B' }}>
              Resumen del Servicio
            </Card.Header>
            <Card.Body className="text-center">
              {formData.logo && (
                <Image src={URL.createObjectURL(formData.logo)} roundedCircle />
              )}
              <h5>{formData.nombreServicio || "Nombre del Servicio"}</h5>
              <p>{formData.descripcion || "Descripción del servicio"}</p>
              <p>{formData.categoria || "Categoría"}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ServicioForm;
