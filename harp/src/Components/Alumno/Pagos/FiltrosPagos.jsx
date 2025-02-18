import React from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaEraser } from "react-icons/fa";

const FiltrosPagos = ({
  searchTerm,
  setSearchTerm,
  estadoCuotaFilter,
  setEstadoCuotaFilter,
  fechaLimitePagoFilter,
  setFechaLimitePagoFilter,
  montoABonarFilter,
  setMontoABonarFilter,
  showFilters,
  setShowFilters,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
  isXLargeScreen,
}) => {
  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchTerm("");
    setEstadoCuotaFilter("");
    setFechaLimitePagoFilter("");
    setMontoABonarFilter("");
  };

  const headerStyle = showFilters
    ? {
        backgroundColor: "#f8f9fa",
        color: "#495057",
        padding: "10px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer"
      }
    : {
        backgroundColor: "#ffffff",
        color: "#495057",
        padding: "10px",
        border: "1px solid #ccc",
        textAlign: "center",
        cursor: "pointer"
      };

  const bodyStyle = {
    padding: "10px",
    overflowY: "auto",
    height: showFilters ? "auto" : "0",
    transition: "height 0.3s ease-in-out, padding-top 0.3s ease-in-out",
  };

  return (
    <Card style={{ height: "100%", overflow: "hidden", borderRadius: 0 }}>
      <Card.Header onClick={() => setShowFilters(!showFilters)} style={headerStyle}>
        {showFilters ? (
          <>
            <span style={{ fontWeight: "bold" }}>Filtros</span>
            <FaChevronLeft />
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClearFilters(e);
              }}
            >
              <FaEraser /> Limpiar
            </Button>
          </>
        ) : (
          <>
            <span style={{ fontWeight: "bold" }}>Filtros</span>
            <FaChevronRight />
          </>
        )}
      </Card.Header>
      {showFilters && (
        <Card.Body style={bodyStyle}>
          <Form>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha Límite</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaLimitePagoFilter}
                    onChange={(e) => setFechaLimitePagoFilter(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Monto a Pagar</Form.Label>
                  <Form.Control
                    type="number"
                    value={montoABonarFilter}
                    onChange={(e) => setMontoABonarFilter(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Estado de la Cuota</Form.Label>
                  <Form.Select
                    value={estadoCuotaFilter}
                    onChange={(e) => setEstadoCuotaFilter(e.target.value)}
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Abonada">Abonada</option>
                    <option value="Vencida">Anulada</option>
                    <option value="Vencida">Vencida</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      )}
    </Card>
  );
};

export default FiltrosPagos;
