import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllServicios } from "../../services/Instructor";
import { Card, Button, Form, Pagination } from "react-bootstrap";

const DescubrirServicios = () => {
  const { idAlumno } = useParams();
  const [servicios, setServicios] = useState([]);
  const [filteredServicios, setFilteredServicios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const serviciosPorPagina = 5;

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await getAllServicios();
        setServicios(data);
        setFilteredServicios(data);
      } catch (error) {
        console.error("Error al obtener servicios", error);
        setServicios([]);
        setFilteredServicios([]);
      }
    };
    fetchServicios();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = servicios.filter((servicio) =>
      servicio.nombre.toLowerCase().includes(value)
    );
    setFilteredServicios(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredServicios.length / serviciosPorPagina);
  const indexOfLastServicio = currentPage * serviciosPorPagina;
  const indexOfFirstServicio = indexOfLastServicio - serviciosPorPagina;
  const currentServicios = filteredServicios.slice(indexOfFirstServicio, indexOfLastServicio);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Descubre nuevos servicios</h2>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar servicio por nombre"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form.Group>
      <div className="d-flex flex-column gap-3">
        {currentServicios.map((servicio) => (
          <Card key={servicio.id} className="d-flex flex-row shadow-sm rounded">
            <Card.Img
              src={servicio.imagen || "https://via.placeholder.com/150"}
              style={{ width: "150px", objectFit: "cover" }}
              className="rounded-start"
            />
            <Card.Body>
              <Card.Title>{servicio.nombre}</Card.Title>
              <Card.Text>{servicio.descripcion}</Card.Text>
              <Button variant="primary">Ver más</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-3">
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
};

export default DescubrirServicios;
