import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onOpcionChange, selectedCourse, setSelectedCourse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);  // Controla si está colapsado o no
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // Controla si el dropdown de cursos está abierto

  const navigate = useNavigate(); // Usar el hook useNavigate

  // Alternar el estado del sidebar (expandido/colapsado)
  const toggleSidebar = () => {
    if (!isCollapsed && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
    setIsCollapsed(!isCollapsed);
  };

  // Cambiar el curso seleccionado y navegar a los detalles del curso
  const handleCourseChange = (course) => {
    setSelectedCourse(course);  // Cambia el curso seleccionado
    onOpcionChange(course); // Cambia la opción en la barra lateral
    navigate(`/alumno/mis-cursos/${course}`); // Navega a la ruta del curso seleccionado
  };

  const handleAddCurso = () => {
    navigate("/crear-curso"); // Navega a la página para crear un nuevo curso
  };

  // Manejar la navegación a "Mis Cursos"
  const handleMisCursosClick = () => {
    onOpcionChange('Mis Cursos'); // Cambia la opción en la barra lateral
    navigate('/alumno/mis-cursos'); // Navega a la ruta de Mis Cursos
  };

  return (
    <nav 
      className={`d-md-block bg-light sidebar ${isCollapsed ? 'collapsed' : ''}`} 
      style={{
        width: isCollapsed ? '80px' : '20vw',
        height: '100vh',
        top: '0', 
        left: '0', 
        transition: 'width 0.3s', 
        zIndex: '1000'
      }}>
      <div className="sidebar-sticky pt-3" style={{ height: '100%' }}>

        {/* Botón de menú hamburguesa */}
        <button 
          className="btn btn-light" 
          onClick={toggleSidebar} 
          style={{ width: '100%', marginBottom: '10px' }}>
          <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
        </button>

        {/* Links del Sidebar */}
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link active" onClick={() => onOpcionChange('General')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-house"></i> {!isCollapsed && 'General'}
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => onOpcionChange('Mis Cursos')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-book"></i> {!isCollapsed && 'Mis Cursos'}
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => onOpcionChange('Pagos')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-wallet"></i> {!isCollapsed && 'Pagos'}
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => onOpcionChange('Asistencias')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-check-circle"></i> {!isCollapsed && 'Asistencias'}
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => onOpcionChange('Reseñas')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-star"></i> {!isCollapsed && 'Reseñas'}
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => onOpcionChange('Configuracion')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-gear"></i> {!isCollapsed && 'Configuración'}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;


