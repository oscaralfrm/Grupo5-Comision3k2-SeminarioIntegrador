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
    metodoPago: ""
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  return (
    <Row className="m-3" style={{ fontFamily: 'Roboto, sans-serif', fontSize:'1.6rem' }}>
      <Col xs={12} md={6}>
        <Card>
          <Card.Header className="fs-3">Registrar Servicio</Card.Header>
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Tab eventKey="general" title="General">
                <Form className="mt-3">
                  <Form.Group controlId="categoria">
                    <Form.Label>Categoría</Form.Label>
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

                  <Form.Group controlId="nombreServicio">
                    <Form.Label>Nombre del Servicio</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombreServicio"
                      value={formData.nombreServicio}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="descripcion">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="ubicacion">
                    <Form.Label>Ubicación</Form.Label>
                    <Form.Control
                      type="text"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="logo">
                    <Form.Label>Logo</Form.Label>
                    <Form.Control
                      type="file"
                      name="logo"
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Form>
              </Tab>

              <Tab eventKey="detalles" title="Detalles">
                <Form className="mt-3">
                  <Form.Group controlId="duracion">
                    <Form.Label>Duración</Form.Label>
                    <Form.Control
                      type="time"
                      name="duracion"
                      value={formData.duracion}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="frecuencia">
                    <Form.Label>Frecuencia</Form.Label>
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

                  <Form.Group controlId="capacidadMaxima">
                    <Form.Label>Capacidad Máxima</Form.Label>
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
                <Form className="mt-3">
                  <Form.Group controlId="costo">
                    <Form.Label>Costo</Form.Label>
                    <Form.Control
                      type="number"
                      name="costo"
                      min="0"
                      value={formData.costo}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="metodoPago">
                    <Form.Label>Método de Pago</Form.Label>
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

      <Col xs={12} md={3}>
        <Card style={{ backgroundColor: '#A5B4fd' }}>
          <Card.Header className="fs-3 fw-bold"style={{fontSize:'1.5rem'}}>Resumen del Servicio</Card.Header>
          <Card.Body className="d-flex flex-column align-items-start">
            <div>
              <h5 style={{ textDecoration: "underline", fontSize:'1.5rem'}}>Información General</h5>
              {formData.categoria && <p><strong style={{ textDecoration: "underline",fontSize:'1.5rem' }}>Categoría:</strong> {formData.categoria}</p>}
              {formData.nombreServicio && <p><strong style={{ textDecoration: "underline",fontSize:'1.5rem' }}>Nombre:</strong> {formData.nombreServicio}</p>}
              {formData.descripcion && <p><strong style={{ textDecoration: "underline",fontSize:'1.5rem' }}>Descripción:</strong> {formData.descripcion}</p>}
              {formData.ubicacion && <p><strong style={{ textDecoration: "underline",fontSize:'1.5rem' }}>Ubicación:</strong> {formData.ubicacion}</p>}

              <h5 style={{ textDecoration: "underline",fontSize:'1.5rem' }}>Detalles</h5>
              {formData.duracion && <p><strong style={{ textDecoration: "underline",fontSize:'1.5rem' }}>Duración:</strong> {formData.duracion}</p>}
              {formData.frecuencia && <p><strong style={{ textDecoration: "underline",fontSize:'1.5rem' }}>Frecuencia:</strong> {formData.frecuencia}</p>}
              {formData.capacidadMaxima && <p><strong style={{ textDecoration: "underline",fontSize:'1.5rem' }}>Capacidad Máxima:</strong> {formData.capacidadMaxima}</p>}

              <h5 style={{ textDecoration: "underline" }}>Precios</h5>
              {formData.costo && <p><strong style={{ textDecoration: "underline" }}>Costo:</strong> {formData.costo}</p>}
              {formData.metodoPago && <p><strong style={{ textDecoration: "underline" }}>Método de Pago:</strong> {formData.metodoPago}</p>}
            </div>
            {formData.logo && (
              <div className="ms-3 text-center">
                <h5>Logo</h5>
                <Image
                  src={URL.createObjectURL(formData.logo)}
                  alt="Logo"
                  thumbnail
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              </div>
            )}
          </Card.Body>
          <Button
            variant="primary"
            className="mt-3 mx-3"
            style={{
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "20px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              fontWeight: "bold",
              fontSize: "0.875rem", 
              padding: "0.3rem 0.8rem", 
              color: "white",
              transition: "transform 0.2s",
              width: "auto", 
              marginBottom: '1em',
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Registrar Servicio
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default ServicioForm;
