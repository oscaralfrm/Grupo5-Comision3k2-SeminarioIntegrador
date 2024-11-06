import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavbarInstructor({ toggleSidebar }) {
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const navigate = useNavigate();

  const handleToggleMenu = () => {
    toggleSidebar(); // Llamamos a la función para alternar el sidebar
  };

  const handleGroupSelect = (group) => {
    console.log('Grupo seleccionado:', group);
    setShowGroupSelector(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#f8f9fa', width: '100%' }}>
      <div className="container-fluid d-flex justify-content-between">
        {/* Botón de menú */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={handleToggleMenu} 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nombre "Harp" centrado */}
        <div className="d-flex align-items-center" style={{ flex: 1, justifyContent: 'center' }}>
          <a className="navbar-brand" href="#" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Harp
          </a>
        </div>

        {/* Selector de grupo */}
        <div className="d-flex align-items-center">
          <a className="nav-link" href="#" onClick={() => setShowGroupSelector(!showGroupSelector)}>
            Seleccionar Grupo
          </a>
          {showGroupSelector && (
            <ul className="dropdown-menu show" style={{ display: 'block' }}>
              <li><a className="dropdown-item" href="#" onClick={() => handleGroupSelect('Grupo 1')}>Grupo 1</a></li>
              <li><a className="dropdown-item" href="#" onClick={() => handleGroupSelect('Grupo 2')}>Grupo 2</a></li>
              <li><a className="dropdown-item" href="#" onClick={() => handleGroupSelect('Grupo 3')}>Grupo 3</a></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavbarInstructor;
