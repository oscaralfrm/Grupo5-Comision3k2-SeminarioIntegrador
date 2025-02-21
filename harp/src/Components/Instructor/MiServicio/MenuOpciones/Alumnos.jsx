import { useState, useEffect } from "react";
import { Card, Button, Row, Col, Form, Container } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import { getGruposDeServicio } from "../../../../services/Grupo.js";
import { getInscripcionesDeServicio } from "../../../../services/Inscripcion.js";
import { calcularAntiguedadComoTexto, calcularEdad } from "./Dashboard/Inscripciones.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Alumnos = () => {
  const navigate = useNavigate();
  const { idServicio, idInstructor } = useParams();
  // const [students, setStudents] = useState([]);
  // const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({ name: "", dni: "", group: "" });
  const [groups, setGroups] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [filteredInscripciones, setFilteredInscripciones] = useState([]);

  // Cargar grupos y alumnos al montar el componente
  useEffect(() => {
    const fetchGroupsAndStudents = async () => {
      try {
        // Obtener los grupos del servicio
        const grupos = await getGruposDeServicio(idServicio);
        setGroups(grupos);

        const inscripciones = await getInscripcionesDeServicio(idServicio, true, false, false);
        setInscripciones(inscripciones);
        setFilteredInscripciones(inscripciones);

        console.log("inscripciones", inscripciones);

      } catch (error) {
        console.error("Error al cargar los grupos o alumnos:", error);
      }
    };

    fetchGroupsAndStudents();
  }, [idServicio]);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    setFilteredInscripciones(
      inscripciones.filter((inscripcion) => {
        console.log("Inscripciones", inscripcion)
        return (
          inscripcion?.alumno?.usuario?.nombre.toLowerCase().includes(filters.name.toLowerCase()) &&
          inscripcion?.alumno?.usuario?.dni?.includes(filters.dni) &&
          (filters.group ? inscripcion.grupo.nombre === filters.group : true)
        );
      })
    );
  }, [filters, inscripciones]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleShowPayments = (inscripcion) => {
    navigate(`/instructor/${idInstructor}/servicio/${idServicio}/inscripciones/${inscripcion.id}`);
  };

  return (
    <Container fluid>
      <div
        className="mx-auto"
        style={{ maxWidth: "1200px", marginTop: "7rem" }}
      >
        {" "}
        {/* Añadimos un contenedor con un ancho máximo */}
        <Row className="mt-3">
          {" "}
          {/* Reducir el margen superior */}
          <Row className="mb-3 d-flex justify-content-between align-items-center">
            {" "}
            {/* Reducir margen inferior */}
            <div className="text-center" style={{ flex: 1 }}>
              <h1 style={{ color: "#1E1B4B", fontWeight: "bold" }}>Alumnos</h1>
            </div>
          </Row>
          {/* Filtros */}
          <Form className="mb-3">
            {" "}
            {/* Reducir margen inferior */}
            <Row className="justify-content-center">
              <Col xs={10} md={4}>
                <Form.Group controlId="filterName" className="text-center">
                  <Form.Label>Nombre y Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Filtrar por nombre"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    style={{ width: "80%", margin: "0 auto" }}
                  />
                </Form.Group>
              </Col>
              <Col xs={10} md={4}>
                <Form.Group controlId="filterDni" className="text-center">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Filtrar por DNI"
                    name="dni"
                    value={filters.dni}
                    onChange={handleFilterChange}
                    style={{ width: "80%", margin: "0 auto" }}
                  />
                </Form.Group>
              </Col>
              <Col xs={10} md={4}>
                <Form.Group controlId="filterGroup" className="text-center">
                  <Form.Label>Grupo</Form.Label>
                  <Form.Control
                    as="select"
                    name="group"
                    value={filters.group}
                    onChange={handleFilterChange}
                    style={{ width: "80%", margin: "0 auto" }}
                  >
                    <option value="">Seleccionar grupo</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.nombre}>
                        {group.nombre}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          {/* Lista de Alumnos filtrados */}
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {filteredInscripciones.map((inscripcion) => (
              <Col key={inscripcion.alumno.id}>
                <Card
                  className="card mb-4"
                  style={{
                    backgroundColor: "#fff",
                    // borderColor: "#4F46E5",
                    borderRadius: "15px",
                    marginBottom: "20px",
                    boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.5)",
                    transition:
                      "transform 0.3s, box-shadow 0.3s, background-color 0.3s",
                  }}
                >
                  {inscripcion.estado === "Finalizada" &&
                    <span
                      className={`badge bg-danger`}
                    >
                      {inscripcion.estado}
                    </span>
                  }


                  {/* Foto del alumno */}
                  <Card.Img
                    variant="top"
                    src={inscripcion.alumno.usuario.fotoPerfilURL || ""}
                    alt={inscripcion.alumno.usuario.nombre}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                      height: "130px",
                      width: "130px",
                      margin: "15px auto 0",
                      display: inscripcion.alumno.usuario.fotoPerfilURL ? "block" : "none",
                    }}
                  />
                  {!inscripcion.alumno.usuario.fotoPerfilURL && (
                    <div
                      style={{
                        borderRadius: "50%",
                        width: "130px",
                        height: "130px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "15px auto 0",
                        border: "3px solid #4F46E5",
                        color: "#4F46E5",
                        fontSize: "4rem",
                      }}
                    >
                      <Person />
                    </div>
                  )}

                  {/* Cuerpo de la tarjeta */}
                  <Card.Body className="text-center">
                    <Card.Title
                      className="mb-1"
                      style={{ fontSize: "1.25rem", fontWeight: "bold" }}
                    >
                      {inscripcion.alumno.usuario.nombre + " " + inscripcion.alumno.usuario.apellido}
                    </Card.Title>
                    <Card.Subtitle
                      className="mb-2 text-muted"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Grupo: {inscripcion.grupo.nombre}
                    </Card.Subtitle>

                    {/* Información adicional del alumno */}
                    <Card.Text>
                      <strong>
                        {inscripcion.estado == "EnCurso" || inscripcion.estado == "Aceptada"
                          ? `Inscripto hace ${calcularAntiguedadComoTexto(inscripcion.fechaAceptacion)}`
                          : `Finalizada hace ${calcularAntiguedadComoTexto(inscripcion.fechaFin)}`}
                      </strong>

                    <br />
                    <strong>Edad:</strong> {calcularEdad(inscripcion.alumno.usuario.fechaNacimiento)}
                    <br />
                    {/* <strong>Teléfono:</strong>{" "} */}
                    <Button
                      onClick={() => {
                        const telefono = inscripcion.alumno.usuario.telefono;
                        if (telefono) {
                          window.open(`https://wa.me/${telefono}`, "_blank");
                        } else {
                          alert(
                            "El alumno no tiene un número de teléfono registrado."
                          );
                        }
                      }}
                      style={{
                        padding: 0 /* Mantén el padding en 0 para el icono */,
                        border: "none" /* Quita el borde del botón */,
                        backgroundColor: "transparent" /* Quita el fondo azul */,
                        color: "inherit" /* Hereda el color del texto padre */,
                        display: "inline-flex" /* Usa inline-flex para alinear icono y texto */,
                        alignItems: "center" /* Alinea verticalmente el icono y el texto */,
                        textDecoration: "none" /* Quita el subrayado del enlace */,
                        fontFamily: "inherit" /* Hereda la fuente del texto padre */,
                        fontSize: "inherit" /* Hereda el tamaño de fuente del texto padre */,
                        cursor: "pointer" /* Indica que es un elemento clickable */,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faWhatsapp}
                        size="lg"
                        color="blue"
                        style={{ marginRight: "5px" }}
                      />
                      {inscripcion.alumno.usuario.telefono}
                    </Button>
                    {/* Aquí se cierra la etiqueta del botón */}
                  </Card.Text>

                  {/* Botones de acciones */}
                  <div className="d-flex justify-content-around mt-3">
                    {/* <Button
                        variant="primary"
                        onClick={() => handleShowAttendance(inscripcion.alumno)}
                      >
                        Asistencias
                      </Button> */}
                    <Button
                      variant="primary"
                      onClick={() => handleShowPayments(inscripcion)}
                    >
                      Ver más
                    </Button>
                  </div>
                </Card.Body>
              </Card>
              </Col>
            ))}
        </Row>
      </Row>
    </div>
    </Container >
  );  

};

export default Alumnos;