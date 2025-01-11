import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavDropdown, Button, Dropdown } from "react-bootstrap"; // Importa los componentes de react-bootstrap
import img from "../../../../assets/LogoHarp420.png";
import { getServiciosDeInstructor } from "../../../../services/Instructor";
import { getServicioById } from "../../../../services/Servicio";
import profileImg from "../../../../assets/profile.png";
import "bootstrap/dist/css/bootstrap.min.css";

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
      // Obtener la ruta actual
      const currentPath = window.location.pathname;

      // Identificar si termina con "mi-servicio" o "info-servicio" o cualquier otra parte final
      const basePath = currentPath.split("/").slice(0, -1).join("/"); // Ruta base sin el último segmento
      const lastSegment = currentPath.split("/").pop(); // Último segmento de la ruta actual

      // Construir la nueva ruta con el patrón actual
      const newPath = `${basePath}/${lastSegment}`.replace(
        /\/servicio\/\d+\//, // Reemplaza la parte `/servicio/:serviceId/`
        `/servicio/${serviceId}/`
      );

      // Navegar a la nueva ruta
      setSelectedService(service);
      navigate(newPath);
    }

    // Cerrar el dropdown
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
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        fontFamily: "Roboto",
        backgroundColor: "#1E1B4B",
        color: "white",
        fontSize: "1.2rem",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo en todas las pantallas */}
        <Navbar.Brand href="/" style={{ margin: "0 auto" }}>
          <img
            src={img}
            alt="Harp Logo"
            width="130"
            className="d-none d-lg-block"
          />
          <img src={img} alt="Harp Logo" width="100" className="d-lg-none" />
        </Navbar.Brand>

        {/* Botón para mostrar/ocultar el menú en pantallas pequeñas */}
        <Navbar.Toggle
          aria-controls="navbarNav"
          onClick={toggleDropdown}
          style={{ border: "none" }} // Eliminar borde
        />

        {/* Contenedor de elementos en el navbar */}
        <Navbar.Collapse id="navbarNav" className={dropdownOpen ? "" : ""}>
          <Nav className="mx-auto">
            {/* Mi Servicio */}
            <Nav.Link
              href={`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`}
              style={{ color: "white" }}
            >
              Mi Servicio
            </Nav.Link>
            {/* Alumnos */}
            <Nav.Link
              href={`/instructor/${idInstructor}/servicio/${idServicio}/alumnos`}
              style={{ color: "white" }}
            >
              Alumnos
            </Nav.Link>
            {/* Cobros */}
            <Nav.Link
              href={`/instructor/${idInstructor}/servicio/${idServicio}/cobros`}
              style={{ color: "white" }}
            >
              Cobros
            </Nav.Link>

            <NavDropdown
              title={
                <span style={{ color: "white" }}>
                  {selectedService
                    ? selectedService.nombre
                    : "Selecciona un servicio"}
                </span>
              }
              id="navbarDropdownMenuLink"
              show={dropdownOpen}
              onClick={toggleDropdown}
              className="custom-dropdown"
            >
              {servicios.map((servicio) => (
                <NavDropdown.Item
                  key={servicio.id}
                  onClick={() => handleSelectService(servicio.id)}
                  className="text-dark" // Mantiene texto oscuro para los items
                >
                  {servicio.nombre}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>

        {/* Menú de perfil a la derecha */}
        <Dropdown align="end">
          <Dropdown.Toggle
            id="dropdown-profile"
            style={{
              background: "none",
              border: "none",
              padding: "0",
              cursor: "pointer",
            }}
          >
            <img
              src={profileImg} // Asegúrate de definir esta imagen
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                backgroundColor: "gray",
              }}
            />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => navigate("/editar-perfil")}>
              Editar perfil
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/")}>
              Cerrar sesión
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <style>
        {`
  .custom-dropdown .dropdown-toggle::after {
    border-top: 0.24em solid white; /* Color negro para la flecha */
    border-right: 0.25em solid transparent;
    border-left: 0.25em solid transparent;
    content: '';
    display: inline-block;
    vertical-align: 0.255em;
    margin-left: 0.5em;
  }
`}
      </style>
    </Navbar>
  );
}

export default NavbarInstructor;
