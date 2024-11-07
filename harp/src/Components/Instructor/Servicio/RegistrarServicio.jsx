import React, { useState } from "react";
import { Tab, Tabs, Card, Form, Button, Col, Row, Image } from "react-bootstrap";

const ServicioForm = () => {
  const [activeTab, setActiveTab] = useState("general");
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

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  return (
    <div style={{ fontFamily: "Roboto, sans-serif" }}>
      <Row className="m-3">
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <Card className="shadow-sm rounded" style={{ border: 'none' }}>
            <Card.Header className="fs-3 text-center bg-primary text-white rounded-top">
              Registrar Servicio
            </Card.Header>
            <Card.Body className="p-4">
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
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
                      <Form.Label className="fw-semibold">Nombre del Servicio</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombreServicio"
                        value={formData.nombreServicio}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="descripcion" className="mt-3">
                      <Form.Label className="fw-semibold">Descripción</Form.Label>
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
                      <Form.Label className="fw-semibold">Frecuencia</Form.Label>
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
                      <Form.Label className="fw-semibold">Capacidad Máxima</Form.Label>
                      <Form.Control
                        type="number"
                        name="capacidadMaxima"
                        min="1"
                        value={formData.capacidadMaxima}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Form>
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
                      <Form.Label className="fw-semibold">Método de Pago</Form.Label>
                      {["Efectivo", "Tarjeta", "Transferencia"].map((metodo) => (
                        <Form.Check
                          key={metodo}
                          type="radio"
                          name="metodoPago"
                          label={metodo}
                          value={metodo.toLowerCase()}
                          checked={formData.metodoPago === metodo.toLowerCase()}
                          onChange={handleInputChange}
                        />
                      ))}
                    </Form.Group>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4} className="mt-4 mt-md-0">
          <Card className="shadow-lg rounded-3 border-0" style={{ backgroundColor: '#f2f6fc' }}>
            <Card.Header className="fs-4 fw-semibold text-center bg-primary text-white rounded-top-3">
              Resumen del Servicio
            </Card.Header>
            <Card.Body className="p-4">
              <div>
                <h6 className="text-primary mb-3 fw-bold">Información General</h6>
                {formData.categoria && <p className="mb-1"><strong>Categoría:</strong> {formData.categoria}</p>}
                {formData.nombreServicio && <p className="mb-1"><strong>Nombre:</strong> {formData.nombreServicio}</p>}
                {formData.descripcion && <p className="mb-1"><strong>Descripción:</strong> {formData.descripcion}</p>}
                {formData.ubicacion && <p className="mb-1"><strong>Ubicación:</strong> {formData.ubicacion}</p>}

                <h6 className="text-primary mt-4 mb-3 fw-bold">Detalles</h6>
                {formData.duracion && <p className="mb-1"><strong>Duración:</strong> {formData.duracion}</p>}
                {formData.frecuencia && <p className="mb-1"><strong>Frecuencia:</strong> {formData.frecuencia}</p>}
                {formData.capacidadMaxima && <p className="mb-1"><strong>Capacidad Máxima:</strong> {formData.capacidadMaxima}</p>}

                <h6 className="text-primary mt-4 mb-3 fw-bold">Precios</h6>
                {formData.costo && <p className="mb-1"><strong>Costo:</strong> {formData.costo}</p>}
                {formData.metodoPago && <p className="mb-1"><strong>Método de Pago:</strong> {formData.metodoPago}</p>}
              </div>
              {formData.logo && (
                <div className="text-center my-4">
                  <Image
                    src={URL.createObjectURL(formData.logo)}
                    alt="Logo"
                    roundedCircle
                    style={{ width: "80px", height: "80px", border: "2px solid #007bff" }}
                  />
                </div>
              )}
            </Card.Body>
            <div className="text-center pb-3">
              <Button
                variant="primary"
                className="rounded-pill px-4 py-2"
                style={{
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Registrar Servicio
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ServicioForm;
