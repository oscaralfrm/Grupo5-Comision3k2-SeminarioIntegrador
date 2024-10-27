import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ setSelectedService, idInstructor }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const services = ["Yoga Adultos", "Entrenamiento Funcional", "Yoga Jóvenes"];

  const toggleSidebar = () => {
    if (!isCollapsed && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
    setIsCollapsed(!isCollapsed);
  };

  const handleServiceChange = (account) => {
    setSelectedService(account);
  };

  return (
    <nav
      className={`d-md-block bg-light sidebar ${isCollapsed ? "collapsed" : ""}`}
      style={{ width: isCollapsed ? '0vw' : '13vw', height: '100vh', top: '0', left: '0', transition: 'width 0s', zIndex: '1000', paddingLeft: '.5vw', marginTop: '6vw' }}
    >
      <div className="sidebar-sticky pt-3" style={{ height: "50%" }}>
        {isDropdownOpen && (
          <ul className="list-group" style={{ marginBottom: "0.5vw" }}>
            {services.map((account, index) => (
              <li key={index} className="list-group-item" onClick={() => handleServiceChange(account)} style={{ cursor: "pointer", paddingLeft: "1vw" }}>
                {account}
              </li>
            ))}
          </ul>
        )}

        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link active" to={`/instructor/${idInstructor}/general`}>
              <i className="bi bi-house"></i> {!isCollapsed && "General"}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/instructor/${idInstructor}/cuotas`}>
              <i className="bi bi-graph-up"></i> {!isCollapsed && "Cuotas"}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/instructor/${idInstructor}/asistencias`}>
              <i className="bi bi-check-circle"></i> {!isCollapsed && "Asistencias"}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/instructor/${idInstructor}/alumnos`}>
              <i className="bi bi-person"></i> {!isCollapsed && "Alumnos"}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/instructor/${idInstructor}/configuracion`}>
              <i className="bi bi-gear"></i> {!isCollapsed && "Configuración"}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
