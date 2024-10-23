import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const Sidebar = ({ onOpcionChange, selectedService }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para manejar el colapso

  // Función para alternar el estado de colapso
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="d-flex">
      {/* Botón de menú hamburguesa siempre visible */}
      <button 
        className={`btn d-flex align-items-center justify-content-start ${isCollapsed ? 'text-dark' : ''}`} 
        onClick={toggleSidebar} 
        style={{ 
          marginBottom: '1vw', 
          backgroundColor: 'transparent', 
          border: 'none', 
          zIndex: '1001', // Asegura que el botón esté por encima del sidebar
          position: 'absolute', 
          left: isCollapsed ? '0' : '250px', // Cambia la posición según el estado
          transition: 'left 0.3s'
        }}>
        <FaBars style={{ fontSize: '1.2rem', marginRight: '0.5rem' }} />
      </button>

      {/* Sidebar */}
      <nav 
        className={`bg-light border-end sidebar ${isCollapsed ? 'collapsed' : ''}`} 
        style={{
          width: isCollapsed ? '0' : '250px',
          height: '100vh',
          transition: 'width 0.3s',
          overflow: 'hidden',
          zIndex: '1000'
        }}>
        <div className="sidebar-sticky pt-3">
          {/* Título del Sidebar */}
          {!isCollapsed && <h4 className="p-3">Menu</h4>} {/* Mostrar solo si no está colapsado */}
          
          {/* Links del Sidebar */}
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to={`/alumno/${selectedService.idAlumno}/general`} className="nav-link" onClick={() => onOpcionChange('General')}>
                <i className="bi bi-house-door"></i> {!isCollapsed && 'General'}
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/alumno/${selectedService.idAlumno}/mis-cursos`} className="nav-link" onClick={() => onOpcionChange('MisCursos')}>
                <i className="bi bi-book"></i> {!isCollapsed && 'Mis Cursos'}
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/alumno/${selectedService.idAlumno}/pagos`} className="nav-link" onClick={() => onOpcionChange('Pagos')}>
                <i className="bi bi-wallet2"></i> {!isCollapsed && 'Pagos'}
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/alumno/${selectedService.idAlumno}/asistencias`} className="nav-link" onClick={() => onOpcionChange('Asistencias')}>
                <i className="bi bi-check-circle"></i> {!isCollapsed && 'Asistencias'}
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/alumno/${selectedService.idAlumno}/reseñas`} className="nav-link" onClick={() => onOpcionChange('Reseñas')}>
                <i className="bi bi-star"></i> {!isCollapsed && 'Reseñas'}
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/alumno/${selectedService.idAlumno}/configuracion`} className="nav-link" onClick={() => onOpcionChange('Configuración')}>
                <i className="bi bi-gear"></i> {!isCollapsed && 'Configuración'}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;



