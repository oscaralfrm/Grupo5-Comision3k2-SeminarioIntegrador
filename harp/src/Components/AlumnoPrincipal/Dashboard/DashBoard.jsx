import React from 'react';

const DashBoard = () => {
  return (
    <div className="container-fluid">
      {/* Row 1: Información de los Cursos */}
      <div className="row mt-4">
        {/* Mis Cursos */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title text-uppercase" style={{ color: '#5a189a' }}>Mis Cursos</h5>
              <ul className="list-group">
                <li className="list-group-item">Curso de Desarrollo Web <span className="badge bg-primary float-end">En Progreso</span></li>
                <li className="list-group-item">Curso de Python Básico <span className="badge bg-secondary float-end">Finalizado</span></li>
                <li className="list-group-item">Curso de React <span className="badge bg-warning float-end">No Comenzado</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pagos Pendientes */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title text-uppercase" style={{ color: '#3c096c' }}>Pagos Pendientes</h5>
              <ul className="list-group">
                <li className="list-group-item">Curso de Desarrollo Web: $50 <span className="badge bg-danger float-end">Pendiente</span></li>
                <li className="list-group-item">Curso de Python Básico: $30 <span className="badge bg-success float-end">Pagado</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reseñas de Instructores */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title text-uppercase" style={{ color: '#240046' }}>Reseñas de Instructores</h5>
              <ul className="list-group">
                <li className="list-group-item">Juan Pérez: <span className="badge bg-success float-end">5 estrellas</span></li>
                <li className="list-group-item">María López: <span className="badge bg-warning float-end">4 estrellas</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Calendario y Cursos Populares */}
      <div className="row">
        {/* Calendario de Pagos */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-uppercase" style={{ color: '#5a189a' }}>Calendario de Pagos</h5>
              {/* Aquí puedes agregar un componente de calendario, como FullCalendar */}
              <div className="calendar-placeholder" style={{ height: '300px', backgroundColor: '#f3f3f3', textAlign: 'center', lineHeight: '300px' }}>
                Calendario de Pagos
              </div>
            </div>
          </div>
        </div>

        {/* Cursos Populares */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-uppercase" style={{ color: '#240046' }}>Cursos Populares</h5>
              <ul className="list-group">
                <li className="list-group-item">Desarrollo Web Completo <span className="badge bg-success float-end">4.8</span></li>
                <li className="list-group-item">Python Avanzado <span className="badge bg-success float-end">4.9</span></li>
                <li className="list-group-item">React para Principiantes <span className="badge bg-success float-end">4.7</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
