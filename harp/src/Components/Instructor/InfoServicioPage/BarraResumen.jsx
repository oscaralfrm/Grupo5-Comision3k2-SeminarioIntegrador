import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal } from 'react-bootstrap';
import { FaRegCalendarAlt, FaUserAlt, FaCoins, FaClock } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getServicioById, definirFechaInicioDeServicio, updateServicio } from '../../../services/Servicio';
import { useNavigate, useParams } from 'react-router-dom';
import { getAlumnosDeServicio } from '../../../services/Alumno';
import { getMontoActualGrupoDeHistorial } from '../../../services/HistorialMontoCuota';
import { getGruposDeServicio } from '../../../services/Grupo';
import { armarStringPrecioYFrecuenciaCobro } from '../../../services/frecuenciaPago';

const BarraResumen = ({ idServicio }) => {
  const [serviceData, setServiceData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [montos, setMontos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { idInstructor } = useParams();

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        console.log('Fetching servicio data for ID:', idServicio); // Log para verificar el ID del servicio
        const data = await getServicioById(idServicio);

        console.log('Servicio data fetched:', data); // Log de los datos obtenidos
        setServiceData(data);

        const alumnosInscritos = await getAlumnosDeServicio(idServicio);
        setAlumnos(alumnosInscritos);

        const grupos = await getGruposDeServicio(idServicio);
        setGrupos(grupos);

        const montosActuales = grupos.map(grupo => getMontoActualGrupoDeHistorial(grupo.historialMontos).monto);
        setMontos(montosActuales);


      } catch (error) {
        console.error('Error al obtener los datos del servicio:', error);
      }
    };

    if (idServicio) fetchServicio();
  }, [idServicio]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSaveDate = async () => {
    if (!selectedDate) return;

    try {
      console.log('Guardando nueva fecha:', selectedDate); // Log para ver qué fecha se está guardando
      setIsSaving(true);
      await definirFechaInicioDeServicio(idServicio, selectedDate.toISOString().split('T')[0]);
      setServiceData((prev) => ({
        ...prev,
        fechaInicio: selectedDate.toISOString().split('T')[0],
      }));
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la fecha:', error);
      alert('Error al guardar la fecha');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuspendService = async () => {
    try {
      console.log('Suspending service with ID:', idServicio); // Log para verificar el ID del servicio
      await updateServicio(idServicio, { fechaInicio: null });
      console.log('Servicio suspendido correctamente'); // Log para confirmar que se suspendió
      setServiceData((prev) => ({
        ...prev,
        fechaInicio: null,
      }));
    } catch (error) {
      console.error('Error al suspender el servicio:', error);
      alert('Error al suspender el servicio');
    }
  };

  const handleViewActivity = () => {
    navigate(`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`);
  };

  const getPrecioMinimo = () => {
    const tipoFrecuenciaPago = serviceData.tipoFrecuenciaPago;
    const montoMinimo = Math.min(...montos);
    return armarStringPrecioYFrecuenciaCobro(montoMinimo,
      tipoFrecuenciaPago.cantCiclo, tipoFrecuenciaPago.unidadCiclo);
  }

  const calcularFrecuenciasSemanales = () => {
    const frecuencias = grupos.map(grupo => grupo.horarios.length);
    
    // Usamos Set para obtener solo las frecuencias únicas
    const frecuenciasUnicas = [...new Set(frecuencias)];
  
    // Mapeamos las frecuencias para que tengan el formato correcto
    const frecuenciasFormateadas = frecuenciasUnicas.map(frecuencia => {
      return `${frecuencia} ${frecuencia === 1 ? "vez" : "veces"} por semana`;
    });
  
    // Unimos las frecuencias formateadas en un string con comas
    return frecuenciasFormateadas.join(", ");
  };

  const calcularHorasSemanales = () => {
    // Calcular las horas semanales de cada grupo
    const horasSemanales = grupos.map(grupo => {
      // Sumar las duraciones de los horarios de un grupo
      const totalHoras = grupo.horarios.reduce((total, horario) => {
        // Convertimos las horas en formato "HH:mm" a minutos y calculamos la duración
        const horaInicio = new Date(`1970-01-01T${horario.horaInicio}:00`);
        const horaFin = new Date(`1970-01-01T${horario.horaFin}:00`);
        const duracion = (horaFin - horaInicio) / (1000 * 60); // Duración en minutos
        console.log(duracion);
        return total + duracion; // Acumulamos la duración total
      }, 0);
  
      // Convertir las horas a un valor en horas
      return totalHoras / 60; // Regresamos el valor en horas
    });
  
    // Usamos un Set para obtener solo las horas semanales únicas
    const horasUnicas = [...new Set(horasSemanales)];
  
    // Unir las horas semanales únicas en un string separado por comas
    return horasUnicas.join(", ");
  };
  
  
  if (!serviceData) return <p>Cargando datos del servicio...</p>;

  return (
    <>
      <Card className="mb-4 p-3">
        <Row className="text-center text-md-start align-items-center">
          <Col className="d-flex flex-column align-items-center">
            <FaRegCalendarAlt size={25} className="mb-2 mt-2 text-primary" />
            {serviceData.fechaInicio ? (
              <>
                <p className="mb-1 fw-bold">Fecha Inicio:</p>
                <p>{serviceData.fechaInicio}</p>
                <Button
                  variant="warning"
                  size="sm"
                  className="mb-3"
                  onClick={handleSuspendService}
                >
                  Suspender
                </Button>
              </>
            ) : (
              <>
                <p className="mb-1 fw-bold">Fecha Inicio</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mb-2"
                  onClick={handleOpenModal}
                >
                  Configurar
                </Button>
              </>
            )}
          </Col>
          <Col className="d-flex flex-column align-items-center">
            <FaClock size={25} className="mb-2 text-success" />
            <p className="mb-1 fw-bold">Clases:</p>
            <p>{calcularFrecuenciasSemanales() || 'No definida'}</p>
          </Col>
          <Col className="d-flex flex-column align-items-center">
            <FaCoins size={25} className="mb-2 text-warning" />
            <p className="mb-1 fw-bold">Desde:</p>
            <p>{getPrecioMinimo() ?? "No definido"}</p>
          </Col>
          <Col className="d-flex flex-column align-items-center">
            <FaUserAlt size={25} className="mb-2 text-info" />
            <p className="mb-1 fw-bold">Inscriptos:</p>
            <p>{alumnos.length} alumnos</p>
          </Col>
          {serviceData.fechaInicio &&
            <Col className="d-flex flex-column align-items-center">
              <i
                className="bi bi-binoculars-fill mb-2 text-primary"
                style={{ fontSize: '25px' }}
              />
              <p className="mb-1 fw-bold">Actividad</p>
              <Button variant="primary" size="sm" onClick={handleViewActivity}>
                Ver Actividad
              </Button>
            </Col>}

        </Row>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Configurar Fecha de Inicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Selecciona una fecha de inicio para el servicio:</p>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              console.log('Fecha seleccionada:', date); // Log para verificar la fecha seleccionada
              setSelectedDate(date);
            }}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveDate}
            disabled={isSaving || !selectedDate}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BarraResumen;
