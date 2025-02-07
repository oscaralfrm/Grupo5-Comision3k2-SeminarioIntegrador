import { useState, useEffect } from "react";
import { Card, Button, Row, Col, Form, Container } from "react-bootstrap";
import { Person, WhatsApp } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import { getGruposDeServicio } from "../../../../services/Grupo.js";
import { getInscripcionesDeServicio } from "../../../../services/Inscripcion.js";
import { calcularAntiguedadComoTexto, calcularEdad } from "./Dashboard/Inscripciones.jsx";

const Alumnos = () => {
  const navigate = useNavigate();
  const { idServicio, idInstructor } = useParams();
  const [inscripciones, setInscripciones] = useState([]);
  const [filteredInscripciones, setFilteredInscripciones] = useState([]);
  const [filters, setFilters] = useState({ name: "", dni: "", group: "" });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupsAndInscripciones = async () => {
      setLoading(true);
      setError(null);

      try {
        const grupos = await getGruposDeServicio(idServicio);
        setGroups(grupos);

        const inscripciones = await getInscripcionesDeServicio(idServicio, true, false);
        setInscripciones(inscripciones);
        setFilteredInscripciones(inscripciones);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsAndInscripciones();
  }, [idServicio]);

  useEffect(() => {
    setFilteredInscripciones(
      inscripciones.filter((inscripcion) => {
        const nombreCompleto = `${inscripcion.alumno.usuario.nombre} ${inscripcion.alumno.usuario.apellido}`.toLowerCase();
        return (
          nombreCompleto.includes(filters.name.toLowerCase()) &&
          inscripcion.alumno.usuario.dni.includes(filters.dni) &&
          (filters.group ? inscripcion.grupo.nombre === filters.group : true)
        );
      })
    );
  }, [filters, inscripciones]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleShowPayments = (inscripcion) => {
    navigate(`/instructor/<span class="math-inline">\{idInstructor\}/servicio/</span>{idServicio}/cobros?alumno=${inscripcion.id}`);
  };

  const handleShowAttendance = (alumno) => {
    navigate(`/instructor/<span class="math-inline">\{idInstructor\}/servicio/</span>{idServicio}/alumnos/${alumno.id}/asistencias`);
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando alumnos...</div>;
  }

  if (error) {
    return <div className="text-center mt-5">Error al cargar alumnos.</div>;
  }

  return (
    <Container fluid>
      {/* ... (resto del código sin cambios) */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {filteredInscripciones.map((inscripcion) => (
          <Col key={inscripcion.alumno.id}>
            <Card className="card mb-4" style={{
              backgroundColor: "#fff",
              borderRadius: "15px",
              marginBottom: "20px",
              boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.5)",
              transition: "transform 0.3s, box-shadow 0.3s, background-color 0.3s"
            }}>
              {/* ... (código de la tarjeta sin cambios en la estructura) */}
              <Card.Text>
                {/* ... (resto de la información) */}
                <strong>Teléfono:</strong>
                <Button
                  variant="link"
                  onClick={() => {
                    const telefono = inscripcion.alumno.usuario.telefono;
                    if (telefono) {
                      window.open(`https://wa.me/${telefono}`, "_blank");
                    } else {
                      alert("El alumno no tiene un número de teléfono registrado.");
                    }
                  }}
                  style={{ padding: 0 }}
                >
                  <WhatsApp size={20} color="green" />
                </Button>
              </Card.Text>
              {/* ... (resto del código sin cambios) */}
            </Card> {/* Cierra la etiqueta Card */}
          </Col>
        ))}
      </Row>
      {/* ... (resto del código) */}
    </Container>
  );
};

export default Alumnos;