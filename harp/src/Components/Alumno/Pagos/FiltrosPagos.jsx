import React, { useState, useEffect } from "react";
import { getInscripcionesVigentesDeAlumno } from "../../../services/Alumno";
import { obtenerUltimasCuotasDeInscripcion } from "../../../services/Cuota";
import { Card, Form, Row, Col, InputGroup, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaEraser } from "react-icons/fa";
import axios from "axios";

const FiltrosPagos = ({ cuotas, setCuotas, filters, setFilters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaLimiiteFilter, setFechaLimiiteFilter] = useState("");
  const [montoABonarFilter, setMontoABonarFilter] = useState("");
  const [estadoCuotaFilter, setEstadoCuotaFilter] = useState("");

  const filterCuotas = (cuotas, filters) => {
    let filteredCuotas = [...cuotas]; // Crea una copia para no mutar el array original

    if (searchTerm) {
      filteredCuotas = filteredCuotas.filter(cuota => {
        // Ajusta esto según cómo sea la estructura de tus cuotas
        return cuota.inscripcion?.servicio?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (estadoCuotaFilter) {
      filteredCuotas = filteredCuotas.filter(cuota => {
        const estadoActual = cuota.cambiosEstado?.find(estado => estado.fechaFin === null);
        return estadoActual?.estadoCuota === estadoCuotaFilter;
      });
    }

    if (fechaLimiiteFilter) {
      filteredCuotas = filteredCuotas.filter(cuota => {
        return cuota.fechaLimitePago === fechaLimiiteFilter; // Considera convertir a formato de fecha si es necesario
      });
    }

    if (montoABonarFilter) {
      filteredCuotas = filteredCuotas.filter(cuota => {
        const totalMonto = (cuota.montoServicio?.monto || 0) + (cuota.recargo || 0);
        return totalMonto.toString() === montoABonarFilter; // Compara como string para evitar problemas de tipo
      });
    }

    return filteredCuotas;
  };

  useEffect(() => {
    // Apply filters whenever cuotas, searchTerm, estadoCuotaFilter, fechaLimiiteFilter, or montoABonarFilter changes
    const filteredCuotas = filterCuotas(cuotas, {
      searchTerm,
      estadoCuota: estadoCuotaFilter,
      fechaLimitePago: fechaLimiiteFilter,
      monto: montoABonarFilter
    });
    setCuotas(filteredCuotas);
  }, [cuotas, searchTerm, estadoCuotaFilter, fechaLimiiteFilter, montoABonarFilter]);

  const handleToggleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setEstadoCuotaFilter("");
    setFechaLimiiteFilter("");
    setMontoABonarFilter("");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterByEstadoCuota = (e) => {
    setEstadoCuotaFilter(e.target.value);
  };

  const handleFilterByFechaLimite = (e) => {
    setFechaLimiiteFilter(e.target.value);
  };

  const handleFilterByMontoABonar = (e) => {
    setMontoABonarFilter(e.target.value);
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", color: "#1E1B4B", marginTop: "18vh" }}>
        Mis Pagos
      </h2>

      <Card>
        <Card.Header
          style={{
            backgroundColor: "#f8f9fa",
            color: "#495057",
            padding: "10px",
            borderBottom: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer"
          }}
          onClick={handleToggleShowFilters}
        >
          <span style={{ fontWeight: "bold" }}>Filtros</span>
          <FaChevronLeft />
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClearFilters();
            }}
          >
            <FaEraser /> Limpiar
          </Button>
        </Card.Header>

        {showFilters && (
          <Card.Body
            style={{
              padding: "10px",
              overflowY: "auto",
              height: "calc(100% - 50px)"
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
                      onChange={handleSearch}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select value={categoriaFilter}>
                      <option value="">Seleccionar categoría</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Límite</Form.Label>
                    <Form.Control
                      type="date"
                      value={fechaLimiiteFilter}
                      onChange={handleFilterByFechaLimite}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Monto a Pagar</Form.Label>
                    <Form.Control
                      type="number"
                      value={montoABonarFilter}
                      onChange={handleFilterByMontoABonar}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Estado de la Cuota</Form.Label>
                    <Form.Select value={estadoCuotaFilter} onChange={handleFilterByEstadoCuota}>
                      <option value="">Seleccionar estado</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="apagada">Apagada</option>
                      <option value="pagada">Pagada</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  {/* Resto de filtros */}
                </Col>
              </Row>
            </Form>
          </Card.Body>
        )}
      </Card>
    </div>
  );
};

export default FiltrosPagos;