import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
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
  // ==================== Datos ====================
  // Ingresos
  const ingresosEsperados = 100000;
  const ingresosRecibidos = 50000;

  const dataEvolucionIngresos = {
    labels: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    datasets: [
      {
        label: 'Evolución de Ingresos',
        data: [40000, 50000, 60000, 70000, 80000, 85000, 90000, 95000, 100000, 105000, 110000, 115000],
        fill: false,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.3,
      },
    ],
  };

  // Precios
  const dataPrecios = {
    labels: ['Inicio', '2 meses', '4 meses', '6 meses', '8 meses', '10 meses', '12 meses'],
    datasets: [
      {
        label: 'Precio de la cuota',
        data: [200, 210, 230, 250, 270, 290, 310],
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.3,
      },
    ],
  };
  const precioActual = 310;
  const similitudPrecios = 85; // Nueva estadística

  // Pagos
  const demoraPromedioPago = 3; // días
  const porcentajeVencimientos = 15; // %
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
  const tiempoPromedioRespuesta = 2.5; // en minutos
  const solicitudesMes = 50;
  const porcentajeRechazadas = 20; // %
  const porcentajeAceptadas = 80; // %
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

  // Comparaciones (datos del backend)
  const precioMasSolicitudes = 320;
  const precioMenosSolicitudes = 280;
  const precioMasInscripciones = 300;
  const precioMenosInscripciones = 260;

  const dataComparacionSolicitudes = {
    labels: ['Mayor Solicitudes', 'Menor Solicitudes'],
    datasets: [
      {
        label: 'Precio ($)',
        data: [precioMasSolicitudes, precioMenosSolicitudes],
        backgroundColor: [
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const dataComparacionInscripciones = {
    labels: ['Mayor Inscripciones', 'Menor Inscripciones'],
    datasets: [
      {
        label: 'Precio ($)',
        data: [precioMasInscripciones, precioMenosInscripciones],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(201, 203, 207, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Asistencias
  const totalAlumnos = 100;
  const porcentajeAsistencia = 90; // %
  const porcentajeInasistencia = 10; // %
  const alumnosAsistenciaPerfecta = 70;
  const clasesNoDadas = 2;
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

  // ==================== Opciones y Estilos ====================
  const chartOptions = {
    responsive: true,
    animation: { duration: 1500 },
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
  };

  // Contenedor con ancho máximo y márgenes laterales
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Roboto, sans-serif',
    color: '#1E1B4B',
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

  // Envoltura para limitar el ancho de los gráficos
  const chartWrapperStyle = {
    width: '100%',
    maxWidth: '50vw',
    margin: '0 auto',
  };

  // ==================== Render ====================
  return (
    <Container style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Estadísticas</h2>
      
      {/* Row 1: Ingresos y Asistencias */}
      <Row>
        <Col md={6}>
          {/* Ingresos Card */}
          <Card style={cardStyle}>
            <Card.Header style={headerStyle}>Ingresos</Card.Header>
            <Card.Body>
              <div style={{ marginBottom: '20px' }}>
                <p style={subtitleStyle}>Ingresos Esperados:</p>
                <p style={valueStyle}>${ingresosEsperados.toLocaleString()}</p>
                <p style={subtitleStyle}>Ingresos Recibidos:</p>
                <p style={valueStyle}>${ingresosRecibidos.toLocaleString()}</p>
              </div>
              <div style={chartWrapperStyle}>
                <Line data={dataEvolucionIngresos} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          {/* Asistencias Card */}
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

      {/* Row 2: Precios y Pagos */}
      <Row>
        <Col md={6}>
          {/* Precios Card */}
          <Card style={cardStyle}>
            <Card.Header style={headerStyle}>Precios</Card.Header>
            <Card.Body>
              <div style={{ marginBottom: '20px' }}>
                <p style={subtitleStyle}>Precio Actual:</p>
                <p style={valueStyle}>${precioActual}</p>
                <p style={subtitleStyle}>Similitud de Precios:</p>
                <p style={valueStyle}>{similitudPrecios}%</p>
              </div>
              <div style={chartWrapperStyle}>
                <Line data={dataPrecios} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          {/* Pagos Card */}
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

      {/* Row 3: Inscripciones (full width) */}
      <Row>
        <Col md={12}>
          {/* Inscripciones Card */}
          <Card style={cardStyle}>
            <Card.Header style={headerStyle}>Inscripciones</Card.Header>
            <Card.Body>
              <div style={{ marginBottom: '20px' }}>
                <p style={subtitleStyle}>Tiempo de Respuesta Promedio:</p>
                <p style={valueStyle}>{tiempoPromedioRespuesta} min</p>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Estadisticas;
