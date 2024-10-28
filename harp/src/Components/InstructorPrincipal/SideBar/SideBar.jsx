import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ setSelectedService, idInstructor, isSidebarVisible }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const services = ["Yoga Adultos", "Entrenamiento Funcional", "Yoga Jóvenes"];

  const toggleSidebar = () => {
    if (!isSidebarVisible && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
    // Esto debería reflejar el nuevo estado de visibilidad
  };

  const handleServiceChange = (service) => {
    setSelectedService(service);
  };

  return (
    <nav
      className={`d-md-block bg-light sidebar ${isSidebarVisible ? "" : "collapsed"}`}
      style={{
        width: isSidebarVisible ? '15vw' : '0vw',
        height: '100vh',
        top: '0',
        left: '0',
        transition: 'width 0.3s', // Transición suave al cambiar el ancho
        zIndex: '1000',
        paddingLeft: isSidebarVisible ? '.5vw' : '0',
        marginTop: '6vw',
      }}
    >
      <div className="sidebar-sticky pt-3" style={{ height: "50%" }}>
        {isDropdownOpen && (
          <ul className="list-group" style={{ marginBottom: "0.5vw" }}>
            {services.map((service, index) => (
              <li key={index} className="list-group-item" onClick={() => handleServiceChange(service)} style={{ cursor: "pointer", paddingLeft: "1vw" }}>
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
