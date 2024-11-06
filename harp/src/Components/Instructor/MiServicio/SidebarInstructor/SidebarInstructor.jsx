import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = ({ idInstructor, isSidebarVisible}) => {
  const idServicio = 1;
  return (
    <div
      className={`sidebar bg-dark text-light position-fixed ${isSidebarVisible ? 'd-block' : 'd-none d-lg-block'}`}
      style={{
        top: '0',
        left: '0',
        width: '250px', // Ancho del sidebar
        height: '100vh', // Ocupa toda la altura
        zIndex: '1000', // Asegura que se muestre por encima
        boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.1)', // Sombra sutil
        transition: 'transform 0.3s ease', // Animación suave para el desplazamiento
      }}
    >
      <div className="sidebar-content">
        {/* Logo */}
        <div className="mb-4">
          <h2 className="text-white" style={{ fontSize: '2rem' }}>Harp</h2>
        </div>

        {/* Menú de navegación */}
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to={`/instructor/${idInstructor}/general/${idServicio}`}>
              <i className="bi bi-house-door"></i> General
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to={`/instructor/${idInstructor}/Miservicio/${idServicio}`}>
              <i className="bi bi-book"></i> Mi Servicio
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to={`/instructor/${idInstructor}/cobros/${idServicio}`}>
              <i className="bi bi-graph-up"></i> Cobros
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to={`/instructor/${idInstructor}/alumnos/${idServicio}`}>
              <i className="bi bi-person"></i> Alumnos
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
