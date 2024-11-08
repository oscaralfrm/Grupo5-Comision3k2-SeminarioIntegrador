import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function NavbarInstructor() {
  const navigate = useNavigate();
  const { idInstructor, idServicio } = useParams();

  // Lista de servicios
  const servicios = [
    { id: 1, nombre: "Servicio 1" },
    { id: 2, nombre: "Servicio 2" },
    { id: 3, nombre: "Servicio 3" },
  ];

  // Estado para manejar el dropdown y el servicio seleccionado
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Maneja la selección de servicio
  const handleSelectService = (serviceId) => {
    if (serviceId) {
      setSelectedService(servicios.find((servicio) => servicio.id === serviceId));
      navigate(`/instructor/${idInstructor}/servicio/${serviceId}/general`);
    }
    setDropdownOpen(false); // Cierra el dropdown después de seleccionar un servicio
  };

  // Función para alternar el estado de visibilidad del dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // UseEffect para seleccionar el servicio correcto al cargar la página
  useEffect(() => {
    if (idServicio) {
      const selected = servicios.find((servicio) => servicio.id === parseInt(idServicio));
      if (selected) {
        setSelectedService(selected);
      }
    }
  }, [idServicio, servicios]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ fontFamily: "Roboto", backgroundColor: '#1E1B4B', color: 'white', width:'100%', height:'13vh', fontSize:'1.2rem' }}>
      
      {/* Botón de toggler en dispositivos móviles */}
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded={dropdownOpen ? "true" : "false"}
        aria-label="Toggle navigation"
        onClick={toggleDropdown}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Menú de navegación */}
      <div className={`collapse navbar-collapse ${dropdownOpen ? "show" : ""}`} id="navbarNavDropdown">
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link" href={`/instructor/${idInstructor}/servicio/${idServicio}/general`} style={{ color: 'white' }}>
              Harp
            </a>
          </li>
        </ul>
        <ul className="navbar-nav mx-auto">
          <li className="nav-item">
            <a className="nav-link" href={`/instructor/${idInstructor}/servicio/${idServicio}/general`} style={{ color: 'white' }}>
              General
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href={`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`} style={{ color: 'white' }}>
              Mi Servicio
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href={`/instructor/${idInstructor}/servicio/${idServicio}/alumnos`} style={{ color: 'white' }}>
              Alumnos
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href={`/instructor/${idInstructor}/servicio/${idServicio}/cobros`} style={{ color: 'white' }}>
              Cobros
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              aria-haspopup="true"
              aria-expanded={dropdownOpen ? "true" : "false"}
              onClick={toggleDropdown}
              style={{ color: 'white' }}
            >
              {selectedService ? selectedService.nombre : "Seleccionar Servicio"}
            </a>
            <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`} aria-labelledby="navbarDropdownMenuLink">
              {servicios.map((servicio) => (
                <button
                  key={servicio.id}
                  className="dropdown-item"
                  onClick={() => handleSelectService(servicio.id)}
                  style={{ color: '#1E1B4B' }} // Color de texto del dropdown
                >
                  {servicio.nombre}
                </button>
              ))}
            </div>
          </li>
        </ul>
        
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/" style={{ color: 'white' }}>
              Cerrar Sesión
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavbarInstructor;
