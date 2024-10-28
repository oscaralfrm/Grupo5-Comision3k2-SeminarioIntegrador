import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function NavbarAlumno({ toggleSidebar }) {
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  const handleToggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
    toggleSidebar();
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top d-" style={{ width: '100%', backgroundColor: '#1E1B4B', overflow: 'hidden' }}>
      <div className="d-flex justify-content-between align-items-center" style={{ width: '100%', padding: '1rem', position: 'relative' }}>
        {/* Botón de menú */}
        <button
          className="btn d-flex align-items-center"
          onClick={handleToggleMenu}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            marginLeft: '-0.4vw',
          }}
        >
          <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
          {isMenuVisible && <span style={{ marginLeft: '0.3rem' }}>Menú</span>}
        </button>

        {/* Título Harp */}
        <h1 style={{
          fontSize: '3vw',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          margin: 0,
        }}>
          Harp
        </h1>

        {/* Botón de cerrar sesión */}
        <Link className="btn btn-outline-light" to="/logout" style={{ color: 'white', fontSize: '1.2rem' }}>
          Cerrar Sesión
        </Link>
      </div>
    </nav>
  );
}

export default NavbarAlumno;
