import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import img from "../../../../assets/LogoHarp420.png";
import { getServiciosDeInstructor } from "../../../../services/Instructor";
import { getServicioById } from "../../../../services/Servicio";

function NavbarInstructor() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const { idInstructor, idServicio } = useParams();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await getServiciosDeInstructor(idInstructor);
        const servicioSeleccionado = await getServicioById(idServicio);
        setSelectedService(servicioSeleccionado);
        setServicios(data);
      } catch (error) {
        console.error("Error al traer los servicios del instructor:", error);
      }
    };
    fetchServicios();
  }, [idInstructor, idServicio]);

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
        (servicio) => servicio.id === parseInt(idServicio, 10)
      );
      if (selected) {
        setSelectedService(selected);
      }
    }
  }, [idServicio, servicios]);

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light fixed-top"
      style={{
        fontFamily: "Roboto",
        backgroundColor: "#1E1B4B",
        color: "white",
        width: "100%",
        fontSize: "1.2rem",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo en pantallas grandes */}
        <a className="navbar-brand d-none d-lg-block" href="/">
          <img src={img} alt="Harp Logo" width="130" />
        </a>

        {/* Logo en pantallas pequeñas */}
        <a className="navbar-brand d-lg-none" href="/">
          <img src={img} alt="Harp Logo" width="100" />
        </a>

        {/* Botón para mostrar/ocultar el menú en pantallas pequeñas */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={dropdownOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={toggleDropdown}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenedor de elementos en el navbar */}
        <div
          className={`collapse navbar-collapse w-100 ${dropdownOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav mx-auto">
            {/* Mi Servicio */}
            <li className="nav-item">
              <a
                className="nav-link"
                href={`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`}
                style={{ color: "white" }}
              >
                Mi Servicio
              </a>
            </li>
            {/* Alumnos */}
            <li className="nav-item">
              <a
                className="nav-link"
                href={`/instructor/${idInstructor}/servicio/${idServicio}/alumnos`}
                style={{ color: "white" }}
              >
                Alumnos
              </a>
            </li>
            {/* Cobros */}
            <li className="nav-item">
              <a
                className="nav-link"
                href={`/instructor/${idInstructor}/servicio/${idServicio}/cobros`}
                style={{ color: "white" }}
              >
                Cobros
              </a>
            </li>
            {/* Configuración */}
            <li className="nav-item">
              <a
                className="nav-link"
                href={`/instructor/${idInstructor}/servicio/${idServicio}/configuracion`}
                style={{ color: "white" }}
              >
                Configuración
              </a>
            </li>
            {/* Selector de servicio */}
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
        </div>

        {/* Cerrar sesión en la misma fila */}
        <ul className="navbar-nav ml-auto">
          {/* Cerrar sesión */}
          <li className="nav-item">
            <a
              className="nav-link"
              href="/"
              style={{ color: "white", whiteSpace: "nowrap" }} // Evita el salto de línea
              onClick={handleClick}
            >
              Cerrar Sesión
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavbarInstructor;
