import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Calendar from 'react-calendar'; // Asegúrate de instalar react-calendar
import 'react-calendar/dist/Calendar.css'; // Importa estilos del calendario

const CursoEspecifico = ({ curso }) => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2>{curso.nombre}</h2>

      {/* Botón de "Atrás" */}
      <button
        className="btn btn-outline-primary mb-4"
        onClick={() => navigate(`/alumno/mis-cursos`)} // Navega de regreso a Mis Cursos
      >
        Atrás
      </button>

      {/* Calendario con fechas importantes */}
      <div className="mb-4">
        <Calendar
          value={new Date(curso.fechaInicio)} // Muestra la fecha de inicio
          tileClassName={({ date }) => {
            const isPaymentDate = curso.pagamentos.some(paymentDate => 
              new Date(paymentDate).toDateString() === date.toDateString()
            );
            return isPaymentDate ? 'highlight' : null; // Resalta fechas de pagos
          }}
        />
      </div>

      {/* Tarjetas con información del curso */}
      <div className="row mb-4">
        {/* Tarjeta de Info sobre el curso */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Info del Curso</h5>
              <p className="card-text">{curso.descripcion}</p>
              <Button onClick={() => navigate(`/curso/${curso.id}/info`)}>Ver Más</Button>
            </div>
          </div>
        </div>

        {/* Tarjeta de Pagos */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Pagos</h5>
              <p className="card-text">Detalles sobre los pagos del curso.</p>
              <Button onClick={() => navigate(`/curso/${curso.id}/pagos`)}>Ver Más</Button>
            </div>
          </div>
        </div>

        {/* Tarjeta de Asistencia */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Asistencia</h5>
              <p className="card-text">Registro de asistencia al curso.</p>
              <Button onClick={() => navigate(`/curso/${curso.id}/asistencia`)}>Ver Más</Button>
            </div>
          </div>
        </div>

        {/* Tarjeta de Reseñas */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Reseñas</h5>
              <p className="card-text">Comentarios y opiniones sobre el curso.</p>
              <Button onClick={() => navigate(`/curso/${curso.id}/reseñas`)}>Ver Más</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursoEspecifico;
