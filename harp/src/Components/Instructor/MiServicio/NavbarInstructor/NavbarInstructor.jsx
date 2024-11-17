import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import img from "../../../../assets/LogoHarp420.png";

function NavbarInstructor() {
  const navigate = useNavigate();
  const servicios = [
    { id: 1, nombre: "Servicio 1" },
    { id: 2, nombre: "Servicio 2" },
    { id: 3, nombre: "Servicio 3" },
  ];
  const { idInstructor, idServicio } = useParams();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelectService = (serviceId) => {
    const service = servicios.find((servicio) => servicio.id === serviceId);
    if (service) {
      setSelectedService(service);
      navigate(`/instructor/${idInstructor}/servicio/${serviceId}/mi-servicio`);
    }
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (idServicio) {
      const selected = servicios.find(
        (servicio) => servicio.id === parseInt(idServicio, 10) // Convertir a número para la comparación
      );
      if (selected) {
        setSelectedService(selected);
      }
    }
  }, [idServicio]);

  const handleClick = () => {
    navigate("/login"); // Redirige a /login
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light fixed-top"
      style={{
        fontFamily: "Roboto",
        backgroundColor: "#1E1B4B",
        color: "white",
        width: "100%",
        height: "13vh",
        fontSize: "1.2rem",
      }}
    >
      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleDropdown}
        style={{ borderColor: "white" }}
      >
        <span
          className="navbar-toggler-icon"
          style={{ filter: "invert(1)" }}
        ></span>
      </button>

      <a className="navbar-brand d-lg-none" href="/" >
        <img src={img} alt="Harp Logo" width="100" />
      </a>
      <div
        className={`collapse navbar-collapse ${dropdownOpen ? "show" : ""}`}
        id="navbarNavDropdown"
      >
        <ul className="nav">
          <li className="nav-item d-none d-lg-block">
            <a
              className="nav-link"
              href={`/`}
              style={{ paddingLeft: "1vw" }}
            >
              <img src={img} alt="Harp Logo" width="130" />
            </a>
          </li>
        </ul>

        <ul className="navbar-nav mx-auto">
          <li className="nav-item">
            <a
              className="nav-link"
              href={`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`}
              style={{ color: "white" }}
            >
              Mi Servicio
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href={`/instructor/${idInstructor}/servicio/${idServicio}/ingresos`}
              style={{ color: "white" }}
            >
              Ingresos
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href={`/instructor/${idInstructor}/servicio/${idServicio}/alumnos`}
              style={{ color: "white" }}
            >
              Alumnos
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href={`/instructor/${idInstructor}/servicio/${idServicio}/cobros`}
              style={{ color: "white" }}
            >
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
              style={{ color: "white" }}
            >
              {selectedService ? selectedService.nombre : "Selecciona un servicio"}
            </a>
            <div
              className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
              aria-labelledby="navbarDropdownMenuLink"
            >
              {servicios.map((servicio) => (
                <button
                  key={servicio.id}
                  className="dropdown-item"
                  onClick={() => handleSelectService(servicio.id)}
                  style={{ color: "#1E1B4B" }}
                >
                  {servicio.nombre}
                </button>
              ))}
            </div>
          </li>
        </ul>

        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/" style={{ color: "white" }} onClick={handleClick}>
              Cerrar Sesión
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavbarInstructor;
