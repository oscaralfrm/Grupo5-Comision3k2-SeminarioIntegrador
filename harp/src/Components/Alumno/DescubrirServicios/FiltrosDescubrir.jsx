import React from "react";
import { Card, Form, Row, Col, InputGroup, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaEraser } from "react-icons/fa";

const FiltrosPanel = ({
  filters,
  setFilters,
  categorias,
  onToggleValue,
  onClearFilters,
  showFilters,
  toggleShowFilters
}) => {
  const {
    searchTerm,
    categoriaFilter,
    ubicacionFilter,
    calificacionMinima,
    modalidadClases,
    conClaseGratis,
    frecuenciaSemanalClases,
    precioMinimo,
    tipoFrecuenciaPago,
    diasSemanales,
    turnos
  } = filters;

  // Estilos para el header según si el panel está abierto o cerrado
  const headerStyle = showFilters
    ? {
      
        color: "#1E1B4B",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer"
      }
    : {
        color: "#495057",
        padding: "10px",
        
        textAlign: "center",
        cursor: "pointer"
      };

  return (
    <Card style={{ height: "100%", overflow: "hidden" }}>
      <Card.Header onClick={toggleShowFilters} style={headerStyle}>
        {showFilters ? (
          <>
            <i class="bi bi-sliders fs-3 "></i>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClearFilters();
              }}
            >
              <FaEraser /> Limpiar
            </Button>
          </>
        ) : (
          <>
           <i class="bi bi-sliders fs-3"></i>

          </>
        )}
      </Card.Header>
      {showFilters && (
        <Card.Body
          style={{
            padding: "10px",
            overflowY: "auto",
            height: "calc(100% - 50px)",
          }}
        >
          <Form>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={categoriaFilter}
                    onChange={(e) => setFilters({ ...filters, categoriaFilter: e.target.value })}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.nombre}>
                        {cat.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Filtrar por ubicación..."
                    value={ubicacionFilter}
                    onChange={(e) => setFilters({ ...filters, ubicacionFilter: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Calificación Mínima</Form.Label>
                  <Form.Select
                    value={calificacionMinima}
                    onChange={(e) => setFilters({ ...filters, calificacionMinima: e.target.value })}
                  >
                    <option value="0">Calificación mínima</option>
                    <option value="1">1 estrella</option>
                    <option value="2">2 estrellas</option>
                    <option value="3">3 estrellas</option>
                    <option value="4">4 estrellas</option>
                    <option value="5">5 estrellas</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Modalidad de Clases</Form.Label>
                  <Form.Select
                    value={modalidadClases}
                    onChange={(e) => setFilters({ ...filters, modalidadClases: e.target.value })}
                  >
                    <option value="">Seleccione...</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Hibrida">Híbrida</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Clase de prueba gratuita"
                    checked={conClaseGratis}
                    onChange={(e) => setFilters({ ...filters, conClaseGratis: e.target.checked })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Frecuencia Semanal de Clases</Form.Label>
                  <Form.Select
                    value={frecuenciaSemanalClases}
                    onChange={(e) =>
                      setFilters({ ...filters, frecuenciaSemanalClases: e.target.value })
                    }
                  >
                    <option value="">Seleccione...</option>
                    {[...Array(7)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} veces
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio Máximo y Frecuencia</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      placeholder="Precio máximo"
                      value={precioMinimo}
                      onChange={(e) => setFilters({ ...filters, precioMinimo: e.target.value })}
                    />
                    <Form.Select
                      value={tipoFrecuenciaPago}
                      onChange={(e) => setFilters({ ...filters, tipoFrecuenciaPago: e.target.value })}
                    >
                      <option value="">Tipo...</option>
                      <option value="Mensual">Mensual</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Diario">Diario</option>

                    </Form.Select>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Se aplicará este filtro solo si se completan ambos campos.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Días de la Semana</Form.Label>
                  <div>
                    {[
                      { es: "Lunes", en: "MONDAY" },
                      { es: "Martes", en: "TUESDAY" },
                      { es: "Miércoles", en: "WEDNESDAY" },
                      { es: "Jueves", en: "THURSDAY" },
                      { es: "Viernes", en: "FRIDAY" },
                      { es: "Sábado", en: "SATURDAY" },
                      { es: "Domingo", en: "SUNDAY" }
                    ].map((dia) => (
                      <Form.Check
                        inline
                        key={dia.en}
                        type="checkbox"
                        label={dia.es}
                        value={dia.en}
                        checked={diasSemanales.includes(dia.en)}
                        onChange={() => onToggleValue("diasSemanales", dia.en)}
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Turnos</Form.Label>
                  <div>
                    {["Mañana", "MedioDia", "Tarde", "Noche", "Madrugada"].map((turno) => (
                      <Form.Check
                        inline
                        key={turno}
                        type="checkbox"
                        label={turno}
                        checked={turnos.includes(turno)}
                        onChange={() => onToggleValue("turnos", turno)}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      )}
    </Card>
  );
};

export default FiltrosPanel;
