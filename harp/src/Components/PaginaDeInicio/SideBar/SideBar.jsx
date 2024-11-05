import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ setSelectedService, idInstructor, isSidebarVisible }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const services = ["Yoga Adultos", "Entrenamiento Funcional", "Yoga Jóvenes"];

  const handleServiceChange = (service) => {
    setSelectedService(service);
  };

  return (
    <nav
      className={`sidebar bg-light ${isSidebarVisible ? "d-block" : "d-none"} position-fixed vh-100`}
    >
      <div className="pt-3">
        {isDropdownOpen && (
          <ul className="list-group mb-3">
            {services.map((service, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => handleServiceChange(service)}
                style={{ cursor: "pointer" }}
              >
                {service}
              </li>
            ))}
          </ul>
        )}
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link active" to={`/instructor/${idInstructor}/general`}>
              <i className="bi bi-house"></i> {isSidebarVisible && "General"}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link active" to={`/instructor/${idInstructor}/servicio`}>
              <i className="bi bi-book"></i> {isSidebarVisible && "Mis Servicios"}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/instructor/${idInstructor}/cuotas`}>
              <i className="bi bi-graph-up"></i> {isSidebarVisible && "Cuotas"}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/instructor/${idInstructor}/asistencias`}>
              <i className="bi bi-check-circle"></i> {isSidebarVisible && "Asistencias"}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/instructor/${idInstructor}/alumnos`}>
              <i className="bi bi-person"></i> {isSidebarVisible && "Alumnos"}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/instructor/${idInstructor}/configuracion`}>
              <i className="bi bi-gear"></i> {isSidebarVisible && "Configuración"}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
