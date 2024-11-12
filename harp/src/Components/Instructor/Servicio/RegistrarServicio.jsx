import React, { useState, useEffect } from "react";
import {
  Tab,
  Tabs,
  Card,
  Form,
  Button,
  Col,
  Row,
  Image,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";

const ServicioForm = () => {
  const [activeTab, setActiveTab] = useState("general");
  const location = useLocation();
  const serviceData = location.state || {};

  const [formData, setFormData] = useState({
    categoria: "",
    nombreServicio: "",
    descripcion: "",
    ubicacion: "",
    logo: null,
    duracion: "",
    frecuencia: "",
    capacidadMaxima: "",
    costo: "",
    metodoPago: "",
  });

  // Actualiza el estado inicial con `serviceData` solo al montar el componente
  useEffect(() => {
    if (serviceData) {
      setFormData((prevData) => ({
        ...prevData,
        categoria: serviceData.categoria || "",
        nombreServicio: serviceData.nombreServicio || "",
        descripcion: serviceData.descripcion || "",
        ubicacion: serviceData.ubicacion || "",
        logo: serviceData.logo || null,
        duracion: serviceData.duracion || "",
        frecuencia: serviceData.frecuencia || "",
        capacidadMaxima: serviceData.capacidadMaxima || "",
        costo: serviceData.costo || "",
        metodoPago: serviceData.metodoPago || "",
      }));
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const goToNextTab = () => {
    if (activeTab === "general") {
      setActiveTab("detalles");
    } else if (activeTab === "detalles") {
      setActiveTab("precio");
    }
  };

  const goToPreviousTab = () => {
    if (activeTab === "detalles") {
      setActiveTab("general");
    } else if (activeTab === "precio") {
      setActiveTab("detalles");
    }
  };

  // Verificación de validez del formulario
  const isValid = Object.values(formData).every(
    (field) => field !== "" && field !== null
  );

  return (
    <div style={{ fontFamily: "Roboto, sans-serif" }}>
      <Row className="m-3" >
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <Card className="shadow-sm rounded" style={{ border: "none" }}>
            <Card.Header
              className="fs-3 text-center text-white rounded-top"
              style={{ backgroundColor: "#1E1B4B",  boxShadow: "0 10px 12px rgba(0, 0, 0, 0.1)"}} 
            >
              Registrar Servicio
            </Card.Header>
            <Card.Body className="p-4"style={{  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)"}}>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
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
                    onClick={goToNextTab} // Avanzar a la siguiente sección
                  >
                    <span className="fs-3" style={{ margin: 0, padding: 0 }}>
                      &#8594;
                    </span>
                  </div>
                </Tab>

                <Tab eventKey="detalles" title="Detalles">
                  <Form>
                    <Form.Group controlId="duracion" className="mt-3">
                      <Form.Label className="fw-semibold">Duración</Form.Label>
                      <Form.Control
                        type="time"
                        name="duracion"
                        value={formData.duracion}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="frecuencia" className="mt-3">
                      <Form.Label className="fw-semibold">
                        Frecuencia
                      </Form.Label>
                      {["Diaria", "Semanal", "Mensual"].map((freq) => (
                        <Form.Check
                          key={freq}
                          type="radio"
                          name="frecuencia"
                          label={freq}
                          value={freq.toLowerCase()}
                          checked={formData.frecuencia === freq.toLowerCase()}
                          onChange={handleInputChange}
                        />
                      ))}
                    </Form.Group>

                    <Form.Group controlId="capacidadMaxima" className="mt-3">
                      <Form.Label className="fw-semibold">
                        Capacidad Máxima
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="capacidadMaxima"
                        min="1"
                        value={formData.capacidadMaxima}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Form>
                  <div className="d-flex justify-content-between">
                    <span
                      className="fs-3 d-flex justify-content-start ms-0"
                      onClick={goToPreviousTab}
                      style={{ cursor: "pointer" }} // Volver a la sección anterior
                    >
                      &#8592;
                    </span>
                    <span
                      className="fs-3"
                      style={{ cursor: "pointer" }}
                      onClick={goToNextTab} // Avanzar a la siguiente sección
                    >
                      &#8594;
                    </span>
                  </div>
                </Tab>
                <Tab eventKey="modalidad" title="Modalidad">
  <Form>
    {/* Frecuencia de las cuotas */}
    <Form.Group controlId="frecuenciaCuotas" className="mt-3">
      <Form.Label className="fw-semibold">¿Con qué frecuencia se realizarán las cuotas?</Form.Label>
      {["Diaria", "Semanal", "Mensual"].map((freq) => (
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
    </Form.Group>

    {/* Fecha límite de pago cada mes */}
    <Form.Group controlId="fechaLimitePago" className="mt-3">
      <Form.Label className="fw-semibold">¿Habrá una fecha límite de pago cada mes?</Form.Label>
      {["Sí", "No"].map((answer) => (
        <Form.Check
          key={answer}
          type="radio"
          name="fechaLimitePago"
          label={answer}
          value={answer.toLowerCase()}
          checked={formData.fechaLimitePago === answer.toLowerCase()}
          onChange={handleInputChange}
        />
      ))}
    </Form.Group>

    {/* Pago anticipado */}
    <Form.Group controlId="pagoAnticipado" className="mt-3">
      <Form.Label className="fw-semibold">¿Se requiere que el alumno realice un pago anticipado?</Form.Label>
      {["Sí", "No"].map((answer) => (
        <Form.Check
          key={answer}
          type="radio"
          name="pagoAnticipado"
          label={answer}
          value={answer.toLowerCase()}
          checked={formData.pagoAnticipado === answer.toLowerCase()}
          onChange={handleInputChange}
        />
      ))}
    </Form.Group>

    {/* Monto de inscripción */}
    <Form.Group controlId="montoInscripcion" className="mt-3">
      <Form.Label className="fw-semibold">¿Requiere un monto de inscripción?</Form.Label>
      {["Sí", "No"].map((answer) => (
        <Form.Check
          key={answer}
          type="radio"
          name="montoInscripcion"
          label={answer}
          value={answer.toLowerCase()}
          checked={formData.montoInscripcion === answer.toLowerCase()}
          onChange={handleInputChange}
        />
      ))}
    </Form.Group>

    {/* Abono de inscripción */}
    {formData.montoInscripcion === "sí" && (
      <Form.Group controlId="abonoInscripcion" className="mt-3">
        <Form.Label className="fw-semibold">¿El monto de inscripción se abonará con antelación o junto con la primera cuota?</Form.Label>
        {["Antelación", "Primera cuota"].map((answer) => (
          <Form.Check
            key={answer}
            type="radio"
            name="abonoInscripcion"
            label={answer}
            value={answer.toLowerCase()}
            checked={formData.abonoInscripcion === answer.toLowerCase()}
            onChange={handleInputChange}
          />
        ))}
      </Form.Group>
    )}
  </Form>

  {/* Navegación de pestañas */}
  <div className="d-flex justify-content-between">
    <span
      className="fs-3 d-flex justify-content-start ms-0"
      onClick={goToPreviousTab}
      style={{ cursor: "pointer" }} // Volver a la sección anterior
    >
      &#8592;
    </span>
    <span
      className="fs-3"
      style={{ cursor: "pointer" }}
      onClick={goToNextTab} // Avanzar a la siguiente sección
    >
      &#8594;
    </span>
  </div>
</Tab>


                <Tab eventKey="precio" title="Precio">
                  <Form>
                    <Form.Group controlId="costo" className="mt-3">
                      <Form.Label className="fw-semibold">Costo</Form.Label>
                      <Form.Control
                        type="number"
                        name="costo"
                        min="0"
                        value={formData.costo}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="metodoPago" className="mt-3">
                      <Form.Label className="fw-semibold">
                        Método de Pago
                      </Form.Label>
                      {["Efectivo", "Tarjeta", "Transferencia"].map(
                        (metodo) => (
                          <Form.Check
                            key={metodo}
                            type="radio"
                            name="metodoPago"
                            label={metodo}
                            value={metodo.toLowerCase()}
                            checked={
                              formData.metodoPago === metodo.toLowerCase()
                            }
                            onChange={handleInputChange}
                          />
                        )
                      )}
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className="fs-3"
                        onClick={goToPreviousTab}
                        style={{ cursor: "pointer" }} // Volver a la sección anterior
                      >
                        &#8592;
                      </span>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!isValid} // Deshabilitar si el formulario no es válido
                        style={{ marginLeft: "auto" }} // Esto asegura que el botón se alinee a la derecha
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

        <Col xs={12} md={4} className="mt-4 mt-md-0">
          <Card
            className="shadow-lg rounded-3 border-0"
            style={{ backgroundColor: "white" }}
          >
            <Card.Header className="fs-4 fw-semibold text-center  text-white rounded-top-3" style={{backgroundColor:'#1E1B4B'}}>
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
