import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavDropdown, Dropdown } from "react-bootstrap";
import img from "../../../../assets/LogoHarp420.png";
import { getInstructorById, getServiciosDeInstructor, getServiciosPublicadosDeInstructor, tieneDatosBancariosCompletos } from "../../../../services/Instructor";
import { getServicioById } from "../../../../services/Servicio";
import profileImg from "../../../../assets/profile.png";
import { FaExclamationCircle } from "react-icons/fa";

function NavbarInstructor() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const { idInstructor, idServicio } = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [tieneDatosCompletos, setTieneDatosCompletos] = useState(null);

  const esteInstructorTieneDatosCompletos = async () => {
    const response = await tieneDatosBancariosCompletos(idInstructor);
    return response;
  }

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await getServiciosPublicadosDeInstructor(idInstructor);
        const servicioSeleccionado = await getServicioById(idServicio);
        setSelectedService(servicioSeleccionado);
        setServicios(data);
      } catch (error) {
        console.error("Error al traer los servicios del instructor:", error);
      }
    };
    fetchServicios();
  }, [idInstructor, idServicio]);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const data = await getInstructorById(idInstructor);
        setInstructor(data);

      } catch (error) {
        console.error("Error al traer el instructor:", error);
      }
    };

    fetchInstructor();
  }, [idInstructor]);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await esteInstructorTieneDatosCompletos(); // Espera a que se resuelva la promesa
        setTieneDatosCompletos(response); // Guarda el resultado en el estado
      } catch (error) {
        console.error("Error al verificar los datos bancarios:", error);
      }
    };

    fetchInstructorData();
  }, [idInstructor]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelectService = (serviceId) => {
    const service = servicios.find((servicio) => servicio.id === serviceId);
    if (service) {
      const currentPath = window.location.pathname;
      const basePath = currentPath.split("/").slice(0, -1).join("/");
      const lastSegment = currentPath.split("/").pop();

      const newPath = `${basePath}/${lastSegment}`.replace(
        /\/servicio\/\d+\//,
        `/servicio/${serviceId}/`
      );

      setSelectedService(service);
      navigate(newPath);
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
      <div className="container-fluid d-flex align-items-center">
        <Navbar.Brand href="/" className="mx-auto">
          <img
            src={img}
            alt="Harp Logo"
            style={{
              height: "auto",
              maxHeight: "50px",
            }}
            className="d-none d-lg-block"
          />
          <img
            src={img}
            alt="Harp Logo"
            style={{
              height: "auto",
              maxHeight: "40px",
            }}
            className="d-lg-none"
          />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="navbarNav"
          onClick={toggleDropdown}
          style={{ border: "none" }}
        />

        <Navbar.Collapse id="navbarNav" className={dropdownOpen ? "show" : ""}>
          <Nav className="mx-auto d-flex justify-content-center w-100">
            <Nav.Link
              href={`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`}
              style={{ color: "white" }}
            >
              Mi Servicio
            </Nav.Link>
            <Nav.Link
              href={`/instructor/${idInstructor}/servicio/${idServicio}/alumnos`}
              style={{ color: "white" }}
            >
              Alumnos
            </Nav.Link>
            <Nav.Link
              href={`/instructor/${idInstructor}/servicio/${idServicio}/cobros`}
              style={{ color: "white" }}
            >
              Cobros
            </Nav.Link>

            <NavDropdown
              title={
                <span style={{ color: "white" }}>
                  {selectedService ? selectedService.nombre : "Selecciona un servicio"}
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
                  className="text-dark"
                >
                  {servicio.nombre}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>

        {/* Contenedor para el perfil */}
        <div className="d-flex align-items-center">
          <Dropdown align="end">
            <Dropdown.Toggle
              id="dropdown-profile"
              style={{
                background: "none",
                border: "none",
                padding: "0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px", // Espacio entre la imagen y el icono
                position: "relative",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={instructor?.usuario?.fotoPerfilURL || profileImg}
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    backgroundColor: "gray",
                  }}
                />
                {!tieneDatosCompletos && (
                  <FaExclamationCircle
                    style={{
                      color: "yellow",
                      fontSize: "18px",
                      position: "absolute",
                      top: "-5px",
                      right: "-5px", // Ajustar posición del ícono de advertencia
                    }}
                  />
                )}
              </div>
            </Dropdown.Toggle>


            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate(`/instructor/${idInstructor}/perfil/ver-perfil`)}>
                Ver perfil
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/")}>
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <style>
        {`
          .custom-dropdown .dropdown-toggle::after {
            border-top: 0.24em solid white; /* Color blanco para la flecha */
            border-right: 0.25em solid transparent;
            border-left: 0.25em solid transparent;
            content: '';
            display: inline-block;
            vertical-align: 0.255em;
            margin-left: 0.5em;
          }

          /* Alinear elementos al centro en pantallas pequeñas */
          @media (max-width: 761px) {
            .navbar-nav {
              display: flex;
              justify-content: center;
              width: 100%;
            }
            .navbar-brand {
              flex-grow: 1;
              text-align: center;
            }
            .d-flex.align-items-center {
              justify-content: center;
              flex-grow: 1; /* Asegurar que el perfil también esté centrado */
            }
          }

          /* Asegurar que la barra de navegación se mantenga centrada en pantallas grandes */
          @media (min-width: 761px) {
            .navbar-nav {
              justify-content: center;
              width: auto; /* Ajustar a auto para mantener el orden */
            }
          }

          /* Cambiar color de las líneas del menú hamburguesa a blanco */
          .navbar-toggler {
            border: none; /* Sin borde */
          }

          .navbar-toggler:focus {
            outline: none; /* Sin contorno en focus */
          }

          .navbar-toggler-icon {
            background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Cpath stroke='white' stroke-width='2' stroke-linecap='round' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E"); /* Icono de hamburguesa blanco */
          }

          .navbar-brand img {
            max-height: 50px; /* Controlar la altura de las imágenes */
          }
        `}
      </style>
    </Navbar>
  );
}

export default NavbarInstructor;