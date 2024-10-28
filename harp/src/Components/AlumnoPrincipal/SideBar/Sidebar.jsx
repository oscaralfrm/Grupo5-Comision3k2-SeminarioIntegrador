import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ onOpcionChange, selectedService, isSidebarVisible }) => {
  // Si isSidebarVisible es false, el componente no se renderiza
  if (!isSidebarVisible) {
    return null;
  }

  return (
    <div className="d-flex" style={{ paddingTop: '4.4vw', paddingLeft: '0.4vw' }}>
      {/* Sidebar */}
      <nav 
        className="bg-light border-end sidebar" 
        style={{
          width: '15vw',
          height: '100vh',
          overflow: 'hidden',
          position: 'absolute',
          zIndex: '1000'
        }}>
        <div className="sidebar-sticky pt-3">
          
          {/* Links del Sidebar */}
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to={`/alumno/${selectedService.idAlumno}/general`} className="nav-link" onClick={() => onOpcionChange('General')}>
                <i className="bi bi-house-door"></i> General
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/alumno/${selectedService.idAlumno}/mis-cursos`} className="nav-link" onClick={() => onOpcionChange('MisCursos')}>
                <i className="bi bi-book"></i> Mis Cursos
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/alumno/${selectedService.idAlumno}/pagos`} className="nav-link" onClick={() => onOpcionChange('Pagos')}>
                <i className="bi bi-wallet2"></i> Pagos
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/alumno/${selectedService.idAlumno}/asistencias`} className="nav-link" onClick={() => onOpcionChange('Asistencias')}>
                <i className="bi bi-check-circle"></i> Asistencias
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/alumno/${selectedService.idAlumno}/reseñas`} className="nav-link" onClick={() => onOpcionChange('Reseñas')}>
                <i className="bi bi-star"></i> Reseñas
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/alumno/${selectedService.idAlumno}/configuracion`} className="nav-link" onClick={() => onOpcionChange('Configuración')}>
                <i className="bi bi-gear"></i> Configuración
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
