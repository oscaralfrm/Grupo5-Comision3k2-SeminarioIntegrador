import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onOpcionChange, selectedService, setSelectedService }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const services = ["Yoga Adultos", "Entrenamiento Funcional", "Yoga Jóvenes"];
  const navigate = useNavigate();

  const toggleSidebar = () => {
    if (!isCollapsed && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
    setIsCollapsed(!isCollapsed);
  };

  const toggleDropdown = () => {
    if (isCollapsed && !isDropdownOpen) {
      setIsCollapsed(false);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleServiceChange = (service) => {
    setSelectedService(service);
    setIsDropdownOpen(false);
  };

  const navigateToOpcion = (opcion) => {
    onOpcionChange(opcion);
  };

  const handleAddServicio = () => {
    navigate("/servicios");
  };

  return (
    <nav
      className={`d-md-block bg-light sidebar ${isCollapsed ? "collapsed" : ""}`}
      style={{
        width: isCollapsed ? '0vw' : '11vw',
        height: '100vh',
        top: '0', 
        left: '0', 
        transition: 'width 0s', 
        zIndex: '1000',
        paddingLeft: '.5vw', // Aplica padding uniforme
        marginTop: '-0.6vw'
      }}
    >
      <div className="sidebar-sticky pt-3" style={{ height: "50%" }}>
        {/* Botón de menú hamburguesa */}
        <button
          className="btn d-flex align-items-center justify-content-start"
          onClick={toggleSidebar}
          style={{
            width: "100%",
            marginBottom: "1vw",
            backgroundColor: "transparent",
            paddingLeft: '0.5vw', // Aplica padding al botón
            marginBlockEnd: '-0.7vw'
          }}
        >
          <i className="bi bi-list" style={{ fontSize: "1.5rem" }}></i>
          {!isCollapsed && <span style={{ marginLeft: "1rem" }}>Menu</span>}
        </button>

        {/* Botón del servicio seleccionado */}
        <div
          className="account-button"
          onClick={toggleDropdown}
          style={{
            marginBottom: "0.5vw",
            cursor: "pointer",
            padding: "1vw",
            borderRadius: "1vw",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            paddingLeft: '1.5vw', // Aplica padding al botón del servicio
            marginBlockEnd:'-0.6vw'
          }}
        >
          {!isCollapsed ? (
            <span>{selectedService}</span>
          ) : (
            <i className="bi bi-info-circle" style={{ fontSize: "1.1rem",color: "#4F46E5" }}></i> // Solo muestra el ícono cuando está colapsado
          )}
          {!isCollapsed && ( // Solo muestra la flecha si el menú no está colapsado
            <i
              className={`bi bi-chevron-${isDropdownOpen ? "up" : "down"}`}
              style={{ marginLeft: 'auto' }}
            ></i>
          )}
        </div>

        {/* Dropdown de cuentas */}
        {isDropdownOpen && (
          <ul className="list-group" style={{ marginBottom: "0.5vw" }}>
            {services.map((account, index) => (
              <li
                key={index}
                className="list-group-item"
                onClick={() => handleServiceChange(account)}
                style={{ cursor: "pointer", paddingLeft: "1vw" }} // Padding uniforme en el dropdown
              >
                {account}
              </li>
            ))}
            <li
              className="list-group-item"
              onClick={handleAddServicio}
              style={{ cursor: "pointer", paddingLeft: "1vw" }} // Padding uniforme
            >
              Crear nuevo servicio
            </li>
          </ul>
        )}

        {/* Links del Sidebar */}
        <ul className="nav flex-column">
          <li className="nav-item">
            <a
              className="nav-link active"
              onClick={() => navigateToOpcion("General")}
              style={{ cursor: "pointer", paddingLeft: "1vw" }} // Padding uniforme
            >
              <i className="bi bi-house"></i> {!isCollapsed && "General"}
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              onClick={() => navigateToOpcion("Cuotas")}
              style={{ cursor: "pointer", paddingLeft: "1vw" }} // Padding uniforme
            >
              <i className="bi bi-graph-up"></i> {!isCollapsed && "Cuotas"}
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              onClick={() => navigateToOpcion("Asistencias")}
              style={{ cursor: "pointer", paddingLeft: "1vw" }} // Padding uniforme
            >
              <i className="bi bi-check-circle"></i> {!isCollapsed && "Asistencias"}
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              onClick={() => navigateToOpcion("Alumnos")}
              style={{ cursor: "pointer", paddingLeft: "1vw" }} // Padding uniforme
            >
              <i className="bi bi-person"></i> {!isCollapsed && "Alumnos"}
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              onClick={() => navigateToOpcion("Configuracion")}
              style={{ cursor: "pointer", paddingLeft: "1vw" }} // Padding uniforme
            >
              <i className="bi bi-gear"></i> {!isCollapsed && "Configuración"}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
