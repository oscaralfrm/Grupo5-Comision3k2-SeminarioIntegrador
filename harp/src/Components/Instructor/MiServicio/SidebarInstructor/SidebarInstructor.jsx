import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = ({ setSelectedService, idInstructor }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const services = ["Yoga Adultos", "Entrenamiento Funcional", "Yoga Jóvenes"];

  const handleServiceChange = (service) => {
    setSelectedService(service);
  };

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  return (
    <nav
      className="sidebar bg-dark text-light"
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "250px", // Ancho del sidebar
        height: "100vh", // Ocupa toda la altura
        zIndex: "1000", // Asegura que se muestre por encima
        boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.1)", // Sombra sutil
        padding: "20px",
      }}
    >
      <div className="sidebar-content">
        {/* Logo */}
        <div className="mb-4">
          <h2 className="text-white" style={{ fontSize: "2rem" }}>Harp</h2>
        </div>

        {/* Menu de navegación */}
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to={`/instructor/${idInstructor}/general`}>
              <i className="bi bi-house-door"></i> General
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to={`/instructor/${idInstructor}/servicio`}>
              <i className="bi bi-book"></i> Mi Servicio
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to={`/instructor/${idInstructor}/cobros`}>
              <i className="bi bi-graph-up"></i> Cobros
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to={`/instructor/${idInstructor}/alumnos`}>
              <i className="bi bi-person"></i> Alumnos
            </Link>
          </li>
        </ul>

        {/* Selector de Servicios */}
        <div className="mt-5">
          <button className="btn btn-secondary w-100" onClick={toggleDropdown}>
            Seleccionar Servicio
          </button>
          {isDropdownOpen && (
            <ul className="list-unstyled p-0">
              {services.map((service, index) => (
                <li key={index} className="mt-2">
                  <button
                    className="btn btn-link text-white w-100"
                    onClick={() => handleServiceChange(service)}
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
