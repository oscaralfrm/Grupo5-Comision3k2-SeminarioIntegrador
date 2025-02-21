import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaRegCalendarAlt, FaUserAlt, FaCoins, FaClock } from 'react-icons/fa';
import { getAlumnosDeServicio } from '../../../services/Alumno';
import { getMontoActualGrupoDeHistorial } from '../../../services/HistorialMontoCuota';
import { updateServicio } from '../../../services/Servicio';
import { useNavigate, useParams } from 'react-router-dom';
import { armarStringPrecioYFrecuenciaCobro } from '../../../services/frecuenciaPago';
import { format, parseISO } from "date-fns";

const BarraResumen = ({ serviceData, grupos, sePuedeEditar }) => {
  const [alumnos, setAlumnos] = useState([]);
  const [montos, setMontos] = useState([]);
  const [precioMin, setPrecioMin] = useState("Sin definir");
  const [frecuencias, setFrecuencias] = useState("");
  const navigate = useNavigate();
  const { idInstructor, idServicio } = useParams();

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const alumnosInscritos = await getAlumnosDeServicio(idServicio);
        setAlumnos(alumnosInscritos);
      } catch (error) {
        console.error('Error al obtener los alumnos del servicio:', error);
      }
    };

    if (idServicio) fetchServicio();
  }, [idServicio]);

  useEffect(() => {
    if (grupos?.length > 0) {
      const montosActuales = grupos.map(
        grupo => getMontoActualGrupoDeHistorial(grupo.historialMontos)?.monto ?? 0
      );
      setMontos(montosActuales);
    } else {
      setMontos([]);
    }
  }, [grupos]);

  useEffect(() => {
    if (montos.length > 0 && serviceData?.tipoFrecuenciaPago) {
      setPrecioMin(getPrecioMinimo());
    } else {
      setPrecioMin("Sin definir");
    }
  }, [montos, serviceData]);

  const handleSuspendService = async () => {
    try {
      await updateServicio(idServicio, { fechaInicio: null });
    } catch (error) {
      console.error('Error al suspender el servicio:', error);
      alert('Error al suspender el servicio');
    }
  };

  const handleViewActivity = () => {
    navigate(`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`);
  };

  const getPrecioMinimo = () => {
    if (!serviceData?.tipoFrecuenciaPago || montos.length === 0) {
      return "Sin definir";
    }

    const montoMinimo = Math.min(...montos);
    return armarStringPrecioYFrecuenciaCobro(
      montoMinimo,
      serviceData.tipoFrecuenciaPago.cantCiclo,
      serviceData.tipoFrecuenciaPago.unidadCiclo
    );
  };

  // Formato de fecha
  const formatDate = (dateString) => {
    if (dateString != null) {
      const date = parseISO(dateString); // Convierte el string "YYYY-MM-DD" en un objeto Date correctamente
      return format(date, "dd/MM/yyyy"); // Formatea a "DD/MM/AAAA"
    }
  };

  const calcularFrecuenciasSemanales = () => {
    const frecuencias = [...new Set(grupos?.map(grupo => grupo?.horarios.length))].sort((a, b) => a - b);
    if (frecuencias.length === 0) return "No definida";
    if (frecuencias.length === 1) return `${frecuencias[0]} ${frecuencias[0] === 1 ? "vez" : "veces"} por semana`;
    return `${frecuencias.slice(0, -1).join(", ")} o ${frecuencias.at(-1)} veces por semana`;
  };

  useEffect(() => {
    setFrecuencias(calcularFrecuenciasSemanales());
  }, [grupos]);

  if (!serviceData) return <p>Cargando datos del servicio...</p>;

  return (
    <Card className="mb-4 p-3">
      <Row className="text-center text-md-start align-items-center">
        <Col className="d-flex flex-column align-items-center">
          <FaRegCalendarAlt size={25} className="mb-2 mt-2 text-primary" />
          <p className="mb-1 fw-bold">Fecha Inicio:</p>
          <p>{formatDate(serviceData?.fechaInicio) || "Sin definir"}</p>

          {/* sePuedeEditar && sePuedeModificarFechaInicio(serviceData?.fechaInicio) &&
            <Button variant="warning" size="sm" className="mb-3" onClick={handleSuspendService}>
            Editar
            </Button>
          

          {serviceData?.fechaInicio && sePuedeEditar && (
            <Button variant="warning" size="sm" className="mb-3" onClick={handleSuspendService}>
              Suspender
            </Button>
          )}
            */}
        </Col>
        {serviceData?.fechaFin != null &&
          <Col className="d-flex flex-column align-items-center">
            <FaRegCalendarAlt size={25} className="mb-2 mt-2 text-primary" />
            <p className="mb-1 fw-bold">Fecha Fin:</p>
            <p>{formatDate(serviceData?.fechaFin) || "Sin definir"}</p>

          </Col>
        }

        <Col className="d-flex flex-column align-items-center text-center">
          <FaClock size={25} className="mb-2 text-success" />
          <p className="mb-1 fw-bold">Frecuencia clases:</p>
          <p>{frecuencias}</p>
        </Col>
        <Col className="d-flex flex-column align-items-center">
          <FaCoins size={25} className="mb-2 text-warning" />
          <p className="mb-1 fw-bold">Desde:</p>
          <p>{precioMin}</p>
        </Col>
        <Col className="d-flex flex-column align-items-center">
          <FaUserAlt size={25} className="mb-2 text-info" />
          <p className="mb-1 fw-bold">Inscriptos:</p>
          <p>{alumnos.length} alumnos</p>
        </Col>
        {serviceData.fechaInicio && sePuedeEditar && (
          <Col className="d-flex flex-column align-items-center">
            <i className="bi bi-binoculars-fill mb-2 text-primary" style={{ fontSize: '25px' }} />
            <p className="mb-1 fw-bold">Actividad</p>

            <Button variant="primary" size="sm" onClick={handleViewActivity}>
              Ver Actividad
            </Button>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default BarraResumen;
