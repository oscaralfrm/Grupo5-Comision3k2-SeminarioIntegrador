import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onOpcionChange, selectedService, setSelectedService }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);  // Controla si está colapsado o no
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // Controla si el dropdown de cuentas está abierto
  
  // BUSCAR EN EL BACK LOS SERVICIOS DE LA CUENTA REGISTRADA
  const services = ['Yoga Adultos', 'Entrenamiento Funcional', 'Yoga Jóvenes'];  // Lista de cuentas registradas
  const navigate = useNavigate(); // Usar el hook useNavigate

  // Alternar el estado del sidebar (expandido/colapsado)
  const toggleSidebar = () => {
    if (!isCollapsed && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
    setIsCollapsed(!isCollapsed);
  };

  // Alternar el dropdown de las cuentas
  const toggleDropdown = () => {
    if(isCollapsed && !isDropdownOpen) {
      setIsCollapsed(false);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Cambiar la cuenta seleccionada
  const handleServiceChange = (service) => {
    setSelectedService(service);  // Cambia el servicio seleccionado
    setIsDropdownOpen(false); // Cierra el dropdown al seleccionar una cuenta
  };

  // Navegar a la ruta del servicio seleccionado
  const navigateToOpcion = (opcion) => {
    onOpcionChange(opcion);
  };

  const handleAddServicio = () => {
    navigate("/servicios")
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

        {/* Botón de la cuenta actual */}
        <div 
          className="account-button" 
          onClick={toggleDropdown} 
          style={{ marginBottom: '10px', cursor: 'pointer', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
          <span>{selectedService}</span>
          <i className={`bi bi-chevron-${isDropdownOpen ? 'up' : 'down'}`} style={{ float: 'right' }}></i>
        </div>

        {/* Dropdown de cuentas */}
        {isDropdownOpen && (
          <ul className="list-group" style={{ marginBottom: '10px' }}>
            {services.map((account, index) => (
              <li 
                key={index} 
                className="list-group-item" 
                onClick={() => handleServiceChange(account)} 
                style={{ cursor: 'pointer' }}>
                {account}
              </li>
            ))}
            <li 
              className="list-group-item" 
              onClick={() => handleAddServicio('Añadir cuenta')} 
              style={{ cursor: 'pointer' }}>
              Crear nuevo servicio
            </li>
          </ul>
        )}

        {/* Links del Sidebar */}
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link active" onClick={() => navigateToOpcion('General')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-house"></i> {!isCollapsed && 'General'}
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => navigateToOpcion('Cuotas')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-graph-up"></i> {!isCollapsed && 'Cuotas'}
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => navigateToOpcion('Asistencias')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-check-circle"></i> {!isCollapsed && 'Asistencias'}
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => navigateToOpcion('Alumnos')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-person"></i> {!isCollapsed && 'Alumnos'}
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => navigateToOpcion('Configuracion')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-gear"></i> {!isCollapsed && 'Configuración'}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
