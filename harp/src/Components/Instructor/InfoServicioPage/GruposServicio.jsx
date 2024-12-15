import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { FaCog } from "react-icons/fa";
import { useParams, useNavigate , Link} from "react-router-dom";
import { getGruposDeServicio } from "../../../services/Grupo";
import { getAlumnosDeGrupo } from "../../../services/Alumno";

function GruposServicio() {
  const { idServicio } = useParams();
  const navigate = useNavigate(); // Hook para la navegación
  const [grupos, setGrupos] = useState([]);
  const [cuposLibres, setCuposLibres] = useState({}); // Estado para almacenar los cupos libres de cada grupo

  useEffect(() => {
    const fetchGrupos = async () => {
      const data = await getGruposDeServicio(idServicio);
      setGrupos(data);
    };
    fetchGrupos();
  }, [idServicio]);

  // Calcular cupos libres
  const calcularCuposLibres = async (grupo) => {
    if (grupo.cantMaxAlumnos === null) return "Con cupos libres";
    const alumnosInscritos = await getAlumnosDeGrupo(idServicio, grupo.id);
    const cuposLibres = grupo.cantMaxAlumnos - alumnosInscritos.length;
    return cuposLibres > 0
      ? `${cuposLibres} cupo(s) libre(s)`
      : "Sin cupos libres";
  };

  const handleEditClick = () => {
    navigate("/edit-grupo"); // Navigate to edit service page
  };

  // Cargar los cupos libres para cada grupo al cargar la información
  useEffect(() => {
    const cargarCuposLibres = async () => {
      const nuevosCuposLibres = {};
      for (const grupo of grupos) {
        const cupos = await calcularCuposLibres(grupo);
        nuevosCuposLibres[grupo.id] = cupos;
      }
      setCuposLibres(nuevosCuposLibres); // Actualizar el estado con los resultados
    };

    if (grupos.length > 0) {
      cargarCuposLibres();
    }
  }, [grupos]);

  // Separar los grupos en clases grupales e individuales según cantMaxAlumnos
  const grupales = grupos.filter((grupo) => grupo.cantMaxAlumnos !== 1);
  const individuales = grupos.filter((grupo) => grupo.cantMaxAlumnos === 1);

  // Ordenar los horarios por día de la semana
  const ordenarPorDia = (horarios) => {
    const diasSemana = {
      Lunes: 0,
      Martes: 1,
      Miércoles: 2,
      Jueves: 3,
      Viernes: 4,
      Sábado: 5,
      Domingo: 6,
    };
    return horarios.sort(
      (a, b) => diasSemana[a.diaSemana.nombre] - diasSemana[b.diaSemana.nombre]
    );
  };

  // Función para navegar a la página de crear grupo
  const handleCrearGrupo = () => {
    navigate(`/crear-grupo/${idServicio}`);
  };

  return (
    <Container
      className="p-3 bg-light "
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
        maxWidth: "100%",
        margin: "auto",
        fontFamily:"Roboto"
      }}
    >
      <div
      className="mb-3"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1E1B4B",
          borderRadius: "8px",
          width: "100%",
          padding: "15px",
        }}
      >
        <h2
          className="text-center "
          style={{ color: "white", fontFamily: "Roboto", fontSize: "1.5em" }}
        >
          Grupos y Horarios
        </h2>

        <Link
          to=""
          style={{
            backgroundColor: "#4F46E5",
            color: "white",
            padding: "10px 20px",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Crear Grupo
        </Link>
      </div>

      <Row>
        {/* Columna para Clases Grupales */}
        <Col md={6} className="mb-4">
          <h5 className="text-start">Clases Grupales</h5>
          {grupales.length > 0 ? (
            grupales.map((grupo) => (
              <Col xs={12} key={grupo.id} className="mb-3">
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                      <Card.Title className="text-start mb-2 mb-md-0">
                        {grupo.nombre}
                      </Card.Title>
                      <span className="text-muted small me-4">
                        {cuposLibres[grupo.id] || "Cargando cupos..."}
                      </span>
                    </div>
                    {/* Edit Button */}
                    <Button
                      variant="light"
                      className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute  "
                      onClick={handleEditClick}
                      style={{
                        backgroundColor: "#1E1B4B",
                        border: "none",
                        top: "10px",
                        right: "10px",
                      }}
                    >
                      <FaCog color="white" size={10} />
                    </Button>

                    {ordenarPorDia(grupo.horarios).map((horario) => (
                      <Card.Text key={horario.id}>
                        {horario.diaSemana.nombre} de{" "}
                        {horario.horaInicio.slice(0, 5)} a{" "}
                        {horario.horaFin.slice(0, 5)}
                      </Card.Text>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No hay clases grupales disponibles.</p>
          )}
        </Col>

        {/* Columna para Clases Individuales */}
        <Col md={6} className="mb-4">
          <h5 className="text-start">Clases Individuales</h5>
          {individuales.length > 0 ? (
            individuales.map((grupo) => (
              <Col xs={12} key={grupo.id} className="mb-3">
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                      <Card.Title className="text-start mb-2 mb-md-0">
                        {grupo.nombre}
                      </Card.Title>
                      <span className="text-muted small">
                        {cuposLibres[grupo.id] || "Cargando cupos..."}
                      </span>
                    </div>
                    {ordenarPorDia(grupo.horarios).map((horario) => (
                      <Card.Text key={horario.id}>
                        {horario.diaSemana.nombre} de{" "}
                        {horario.horaInicio.slice(0, 5)} a{" "}
                        {horario.horaFin.slice(0, 5)}
                      </Card.Text>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No hay clases individuales disponibles.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default GruposServicio;
