import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Calendar from 'react-calendar'; // Asegúrate de instalar react-calendar
import 'react-calendar/dist/Calendar.css'; // Importa estilos del calendario

const CursoEspecifico = () => {
  const navigate = useNavigate();
  const { idAlumno, idCurso } = useParams();
  const location = useLocation(); // Accede a la ubicación
  const { curso } = location.state || {}; // Obtener el curso completo

  if (!curso) {
    return <div>No se encontró el curso.</div>; // Mensaje si no hay curso
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">{curso.nombre}</h2> {/* Título centrado */}

      {/* Tarjetas con información del curso */}
      <div className="row mb-4">
        {/* Tarjeta de Info sobre el curso */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Info del Curso</h5>
              <p className="card-text">{curso.descripcion}</p>
              <Button onClick={() => navigate(`/alumno/${idAlumno}/mis-cursos/${idCurso}/info`)}>Ver Más</Button>
            </div>
          </div>
        </div>

        {/* Tarjeta de Pagos */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Pagos</h5>
              <p className="card-text">Último pago: {curso.ultimoPago} <br/> Próximo pago: {curso.proximoPago}</p>
              <Button onClick={() => navigate(`/alumno/${idAlumno}/mis-cursos/${idCurso}/pagos`)}>Ver Más</Button>
            </div>
          </div>
        </div>

        {/* Tarjeta de Asistencia */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Asistencia</h5>
              <p className="card-text">Última clase: {curso.ultimaClase}</p>
              <Button onClick={() => navigate(`/alumno/${idAlumno}/mis-cursos/${idCurso}/asistencia`)}>Ver Más</Button>
            </div>
          </div>
        </div>

        {/* Tarjeta de Reseñas */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Reseñas</h5>
              <p className="card-text">Comentarios y opiniones sobre el curso.</p>
              <Button onClick={() => navigate(`/alumno/${idAlumno}/mis-cursos/${idCurso}/reseñas`)}>Ver Más</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendario con fechas importantes a la derecha de las tarjetas */}
      <div className="row mb-4">
        <div className="col-md-12">
          <Calendar
            value={new Date()} // Cambiar por `new Date(curso.fechaInicio)` cuando tengas la fecha de inicio
            tileClassName={({ date }) => {
              // Simulación de fechas de pagos para resaltar, modificar según disponibilidad en backend
              const isPaymentDate = curso.pagamentos?.some(paymentDate => 
                new Date(paymentDate).toDateString() === date.toDateString()
              );
              return isPaymentDate ? 'highlight' : null; // Resalta fechas de pagos
            }}
          />
        </div>
      </div>

      {/* Botón de "Atrás" en la esquina inferior izq */}
      <div className="text-left">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate(`/alumno/${idAlumno}/mis-cursos`)} // Navega de regreso a Mis Cursos
        >
          Atrás
        </button>
      </div>
    </div>
  );
};

export default CursoEspecifico;

