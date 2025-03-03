import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useParams } from 'react-router-dom';
import {
  getServiciosPublicadosDeInstructor,
  getServiciosVigentesDeInstructor,
  // Estadísticas de instructor
  obtenerEstadisticasAsistenciasDeInstructor,
  obtenerEstadisticasIngresosDeInstructor,
  obtenerEstadisticasInscripcionesDeInstructor,
  obtenerEstadisticasPagosDeInstructor,
  obtenerEstadisticasPreciosDeInstructor,
} from '../../../services/Instructor';
import {
  // Estadísticas de servicio
  obtenerEstadisticasAsistenciasDeServicio,
  obtenerEstadisticasIngresosDeServicio,
  obtenerEstadisticasInscripcionesDeServicio,
  obtenerEstadisticasPagosDeServicio,
  obtenerEstadisticasPreciosDeServicio,
} from '../../../services/Servicio';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Estadisticas = () => {
  const { idInstructor } = useParams();
  const [ingresos, setIngresos] = useState(null);
  const [precios, setPrecios] = useState(null);
  const [asistencias, setAsistencias] = useState(null);
  const [pagos, setPagos] = useState(null);
  const [inscripciones, setInscripciones] = useState(null);

  // Estados para el selector de servicios
  const [servicios, setServicios] = useState([]);
  const [selectedServicio, setSelectedServicio] = useState(null);

  // Estados para mes y año
  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(months[currentDate.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Generar lista de años (por ejemplo, de 5 años atrás al año siguiente)
  const years = [];
  for (let y = currentDate.getFullYear() - 5; y <= currentDate.getFullYear() + 1; y++) {
    years.push(y);
  }

  // Obtener la lista de servicios del instructor
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const serviciosData = await getServiciosVigentesDeInstructor(idInstructor);
        setServicios(serviciosData);
      } catch (error) {
        console.error("Error al obtener servicios del instructor:", error);
      }
    };
    fetchServicios();
  }, [idInstructor]);

  // Obtener estadísticas según si se seleccionó un servicio o no, usando el mes y año seleccionados
  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const mesActual = selectedMonth; // En mayúsculas y en inglés
        const anioActual = selectedYear;

        if (selectedServicio) {
          // Estadísticas para el servicio seleccionado
          const ingresosData = await obtenerEstadisticasIngresosDeServicio(selectedServicio.id, mesActual, anioActual);
          setIngresos(ingresosData);
          const asistenciasData = await obtenerEstadisticasAsistenciasDeServicio(selectedServicio.id, mesActual, anioActual);
          setAsistencias(asistenciasData);
          const preciosData = await obtenerEstadisticasPreciosDeServicio(selectedServicio.id, mesActual, anioActual);
          setPrecios(preciosData);
          const pagosData = await obtenerEstadisticasPagosDeServicio(selectedServicio.id, mesActual, anioActual);
          setPagos(pagosData);
          const inscripcionesData = await obtenerEstadisticasInscripcionesDeServicio(selectedServicio.id, mesActual, anioActual);
          setInscripciones(inscripcionesData);
        } else {
          // Estadísticas del instructor
          const ingresosData = await obtenerEstadisticasIngresosDeInstructor(idInstructor, mesActual, anioActual);
          setIngresos(ingresosData);
          const asistenciasData = await obtenerEstadisticasAsistenciasDeInstructor(idInstructor, mesActual, anioActual);
          setAsistencias(asistenciasData);
          const preciosData = await obtenerEstadisticasPreciosDeInstructor(idInstructor, mesActual, anioActual);
          setPrecios(preciosData);
          const pagosData = await obtenerEstadisticasPagosDeInstructor(idInstructor, mesActual, anioActual);
          setPagos(pagosData);
          const inscripcionesData = await obtenerEstadisticasInscripcionesDeInstructor(idInstructor, mesActual, anioActual);
          setInscripciones(inscripcionesData);
        }
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      }
    };
    fetchEstadisticas();
  }, [idInstructor, selectedServicio, selectedMonth, selectedYear]);

  // Manejar la selección de un servicio
  const handleServicioChange = (e) => {
    const servicioId = e.target.value;
    const servicio = servicios.find(s => s.id.toString() === servicioId);
    setSelectedServicio(servicio || null);
  };

  // Manejar la selección de mes y año
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // ==================== Configuración de gráficos y datos ====================
  // Ingresos
  const ingresosEsperados = ingresos?.ingresosEsperados;
  const ingresosRecibidos = ingresos?.ingresosRecibidos;
  const dataEvolucionIngresos = {
    labels: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    datasets: [
      {
        label: 'Evolución de Ingresos',
        data: ingresos?.ingresosPorMes,
        fill: false,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.3,
      },
    ],
  };

  // Precios
  const dataPrecios = {
    labels: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    datasets: [
      {
        label: 'Precio de la cuota',
        data: precios?.preciosPromedioGruposPorMes,
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.3,
      },
    ],
  };
  const precioActual = precios?.precioPromedioGrupos;
  const similitudPrecios = precios?.similitudConPreciosCategoria;

  // Pagos
  const demoraPromedioPago = pagos?.demoraPromedioPagosEnDias;
  const porcentajeVencimientos = pagos?.porcentajePromedioVencimientos;
  const dataPagos = {
    labels: ['Demora (días)'],
    datasets: [
      {
        label: 'Demora Promedio',
        data: [demoraPromedioPago],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Inscripciones
  const tiempoPromedioRespuesta = inscripciones?.tiempoRespuestaPromedioEnDias;
  const solicitudesMes = inscripciones?.cantSolicitudes;
  const porcentajeAceptadas = inscripciones?.porcentajeSolicitudesAceptadas;
  const porcentajeRechazadas = 100 - (porcentajeAceptadas || 0);
  const maxPorcentajeSolicitud = Math.max(porcentajeAceptadas, porcentajeRechazadas);
  const dataInscripcionesSolicitudes = {
    labels: ['Aceptadas', 'Rechazadas'],
    datasets: [
      {
        label: 'Porcentaje',
        data: [porcentajeAceptadas, porcentajeRechazadas],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Asistencias
  const totalAlumnos = inscripciones?.cantAlumnos;
  const porcentajeAsistencia = asistencias?.porcentajeAsistenciasPromedio;
  const porcentajeInasistencia = asistencias?.porcentajeInasistenciasPromedio;
  const alumnosAsistenciaPerfecta = asistencias?.alumnosConAsistenciaPerfecta?.length;
  const clasesNoDadas = asistencias?.cantidadClasesNoDadas;
  const dataAsistencias = {
    labels: ['Asistencia', 'Inasistencia'],
    datasets: [
      {
        label: 'Porcentaje',
        data: [porcentajeAsistencia, porcentajeInasistencia],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // ==================== Opciones y estilos ====================
  const chartOptions = {
    responsive: true,
    animation: { duration: 1500 },
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
  };
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Roboto, sans-serif',
    color: '#1E1B4B',
    marginTop: "120px"
  };
  const cardStyle = {
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    border: 'none',
    borderRadius: '10px',
  };
  const headerStyle = {
    backgroundColor: '#1E1B4B',
    color: '#fff',
    padding: '10px 20px',
    textAlign: 'center',
    borderRadius: '10px 10px 0 0',
  };
  const subtitleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1E1B4B',
    marginBottom: '5px',
  };
  const valueStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: '10px',
  };
  const chartWrapperStyle = {
    width: '100%',
    maxWidth: '50vw',
    margin: '0 auto',
  };
  const monthNamesES = {
    'JANUARY': 'Enero',
    'FEBRUARY': 'Febrero',
    'MARCH': 'Marzo',
    'APRIL': 'Abril',
    'MAY': 'Mayo',
    'JUNE': 'Junio',
    'JULY': 'Julio',
    'AUGUST': 'Agosto',
    'SEPTEMBER': 'Septiembre',
    'OCTOBER': 'Octubre',
    'NOVEMBER': 'Noviembre',
    'DECEMBER': 'Diciembre',
  };

  return (
    <Container style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Estadísticas {selectedServicio ? `de ${selectedServicio.nombre}` : 'Generales'} - {monthNamesES[selectedMonth]} {selectedYear}
      </h2>

      {/* Selector de servicios */}
      <Form.Group controlId="servicioSelect" style={{ marginBottom: '20px' }}>
        <Form.Label>Selecciona un Servicio</Form.Label>
        <Form.Control
          as="select"
          onChange={handleServicioChange}
          value={selectedServicio ? selectedServicio.id : ''}
        >
          <option value="">-- Seleccione un servicio --</option>
          {servicios.map(servicio => (
            <option key={servicio.id} value={servicio.id}>
              {servicio.nombre}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {/* Selector de mes */}
      <Form.Group controlId="monthSelect" style={{ marginBottom: '20px' }}>
        <Form.Label>Selecciona un Mes</Form.Label>
        <Form.Control as="select" value={selectedMonth} onChange={handleMonthChange}>
          {months.map(month => (
            <option key={month} value={month}>
             {monthNamesES[month]}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {/* Selector de año */}
      <Form.Group controlId="yearSelect" style={{ marginBottom: '20px' }}>
        <Form.Label>Selecciona un Año</Form.Label>
        <Form.Control as="select" value={selectedYear} onChange={handleYearChange}>
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      

      {/* Renderizado de las estadísticas generales */}
      <Row>
        <Col md={6}>
          <Card style={cardStyle}>
            <Card.Header style={headerStyle}>Ingresos</Card.Header>
            <Card.Body>
              <div style={{ marginBottom: '20px' }}>
                <p style={subtitleStyle}>Ingresos Esperados:</p>
                <p style={valueStyle}>${ingresosEsperados}</p>
                <p style={subtitleStyle}>Ingresos Recibidos:</p>
                <p style={valueStyle}>${ingresosRecibidos}</p>
              </div>
              <div style={chartWrapperStyle}>
                <Line data={dataEvolucionIngresos} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card style={cardStyle}>
            <Card.Header style={headerStyle}>Asistencias</Card.Header>
            <Card.Body>
              <div style={{ marginBottom: '20px' }}>
                <p style={subtitleStyle}>Total de Alumnos:</p>
                <p style={valueStyle}>{totalAlumnos}</p>
                <p style={subtitleStyle}>Alumnos con Asistencia Perfecta:</p>
                <p style={valueStyle}>{alumnosAsistenciaPerfecta}</p>
                <p style={subtitleStyle}>Clases No Dadas en el Mes:</p>
                <p style={valueStyle}>{clasesNoDadas}</p>
              </div>
              <div style={chartWrapperStyle}>
                <p style={subtitleStyle}>Asistencia vs Inasistencia</p>
                <Bar data={dataAsistencias} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card style={cardStyle}>
            <Card.Header style={headerStyle}>Precios</Card.Header>
            <Card.Body>
              <div style={{ marginBottom: '20px' }}>
                <p style={subtitleStyle}>Precio Promedio Actual:</p>
                <p style={valueStyle}>${precioActual}</p>
                <p style={subtitleStyle}>Similitud precios con categoria {selectedServicio?.categoria?.nombre}: </p>
                <p style={valueStyle}>{similitudPrecios}%</p>
              </div>
              <div style={chartWrapperStyle}>
                <Line data={dataPrecios} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card style={cardStyle}>
            <Card.Header style={headerStyle}>Pagos</Card.Header>
            <Card.Body>
              <div style={{ marginBottom: '20px' }}>
                <p style={subtitleStyle}>Demora Promedio:</p>
                <p style={valueStyle}>{demoraPromedioPago} días</p>
                <p style={subtitleStyle}>Vencimientos:</p>
                <p style={valueStyle}>{porcentajeVencimientos}%</p>
              </div>
              <div style={chartWrapperStyle}>
                <Bar data={dataPagos} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card style={cardStyle}>
            <Card.Header style={headerStyle}>Inscripciones</Card.Header>
            <Card.Body>
              <div style={{ marginBottom: '20px' }}>
                <p style={subtitleStyle}>Tiempo de Respuesta Promedio:</p>
                <p style={valueStyle}>{tiempoPromedioRespuesta} días</p>
                <p style={subtitleStyle}>Solicitudes del Mes:</p>
                <p style={valueStyle}>{solicitudesMes}</p>
              </div>

                           
              <Row>
                <Col md={6}>
                  <p style={subtitleStyle}>Solicitudes Aceptadas vs Rechazadas</p>
                  <div style={chartWrapperStyle}>
                    <Bar data={dataInscripcionesSolicitudes} options={chartOptions} />
                  </div>
                </Col>
                <Col md={6} className="d-flex align-items-center justify-content-center">
                  <p style={valueStyle}>{maxPorcentajeSolicitud}%</p>
                </Col>
              </Row>
               {/*
              <Row style={{ marginTop: '20px' }}>
                <Col md={6}>
                  <p style={subtitleStyle}>Comparación Solicitudes</p>
                  <div style={chartWrapperStyle}>
                    <Bar data={dataComparacionSolicitudes} options={chartOptions} />
                  </div>
                </Col>
                <Col md={6}>
                  <p style={subtitleStyle}>Comparación Inscripciones</p>
                  <div style={chartWrapperStyle}>
                    <Bar data={dataComparacionInscripciones} options={chartOptions} />
                  </div>
                </Col>
              </Row>
               */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Estadisticas;
