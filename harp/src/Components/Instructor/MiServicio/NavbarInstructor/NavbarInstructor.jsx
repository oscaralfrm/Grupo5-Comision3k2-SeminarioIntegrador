import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function NavbarInstructor({ toggleSidebar, groupOptions = [] }) {
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const navigate = useNavigate();
  groupOptions = ["Servicio de Tutoría", "Servicio de Yoga", "Servicio de Música"];
  const handleToggleMenu = () => {
    toggleSidebar(); // Llamamos a la función para alternar el sidebar
  };

  const handleGroupSelect = (group) => {
    console.log("Grupo seleccionado:", group);
    setShowGroupSelector(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light w-100">
      <div className="container-fluid">
        {/* Botón de menú a la izquierda del todo */}
        <button
          type="button"
          onClick={handleToggleMenu}
          aria-label="Toggle navigation"
          style={{
            marginRight: "1rem",
            color: "black",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nombre "Harp" centrado */}
        <div className="d-flex align-items-center flex-grow-1 justify-content-center">
          <a
            className="navbar-brand m-0"
            href="#"
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            Harp
          </a>
        </div>

        {/* Selector de grupo a la derecha */}
        <div className="d-flex align-items-center position-relative">
          <a
            className="nav-link"
            href="#"
            onClick={() => setShowGroupSelector(!showGroupSelector)}
          >
            Seleccion Servicio
          </a>
          {showGroupSelector && (
            <ul
              className="dropdown-menu show"
              style={{ position: "absolute", right: 0, top: "100%", marginTop: "1.2rem" }}
            >
              {groupOptions.map((group, index) => (
                <li key={index}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => handleGroupSelect(group)}
                  >
                    {group}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavbarInstructor;
