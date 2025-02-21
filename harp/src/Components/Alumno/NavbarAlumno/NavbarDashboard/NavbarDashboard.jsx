import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavDropdown, Dropdown } from "react-bootstrap";
import img from "../../../../assets/LogoHarp420.png";
import { getInscripcionesDeAlumno, getInscripcionesVigentesDeAlumno } from "../../../../services/Alumno";
import { getServicioById } from "../../../../services/Servicio";
import profileImg from "../../../../assets/profile.png";
import { traerUnaInscripcion } from "../../../../services/Inscripcion";

function NavbarAlumnoDash({usuario}) {
  const navigate = useNavigate();
  const [inscripciones, setInscripciones] = useState([]);
  const { idAlumno, idInscripcion } = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedInscripcion, setSelectedInscripcion] = useState(null);

  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        const data = await getInscripcionesVigentesDeAlumno(idAlumno);
        const inscripcionSeleccionada = await traerUnaInscripcion(idInscripcion);
        setSelectedInscripcion(inscripcionSeleccionada);
        setInscripciones(data);
      } catch (error) {
        console.error("Error al traer las inscripciones del alumno:", error);
      }
    };
    fetchInscripciones();
  }, [idAlumno, idInscripcion]);

  const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };
  
    const handleSelectedInscripcion = (inscripcionId) => {
      const inscripcion = inscripciones.find((inscripcion) => inscripcion.id === inscripcionId);
      if (inscripcion) {
        const currentPath = window.location.pathname;
        const basePath = currentPath.split("/").slice(0, -1).join("/");
        const lastSegment = currentPath.split("/").pop();
  
        const newPath = `${basePath}/${lastSegment}`.replace(
          /\/inscripciones\/\d+\//,
          `/inscripciones/${inscripcionId}/`
        );
  
        setSelectedInscripcion(inscripcion);
        navigate(newPath);
      }
      setDropdownOpen(false);
    };
  
    useEffect(() => {
      if (idInscripcion) {
        const selected = inscripciones.find(
          (inscripcion) => inscripcion.id === parseInt(idInscripcion, 10)
        );
        if (selected) {
          setSelectedInscripcion(selected);
        }
      }
    }, [idInscripcion, inscripciones]);
  
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
                href={`/alumno/${idAlumno}/inscripciones/${idInscripcion}/mi-inscripcion`}
                style={{ color: "white" }}
              >
                Mi Inscripcion
              </Nav.Link>
          {/*     <Nav.Link
                href={`/instructor/${idAlumno}/servicio/${idServicio}/alumnos`}
                style={{ color: "white" }}
              >
                Alumnos
              </Nav.Link> */}
              <Nav.Link
                href={`/alumno/${idAlumno}/inscripciones/${idInscripcion}/resenias`}
                style={{ color: "white" }}
              >
                Reseñas
              </Nav.Link>
  
              <NavDropdown
                title={
                  <span style={{ color: "white" }}>
                    {selectedInscripcion ? selectedInscripcion.servicio.nombre : "Selecciona un servicio"}
                  </span>
                }
                id="navbarDropdownMenuLink"
                show={dropdownOpen}
                onClick={toggleDropdown}
                className="custom-dropdown"
              >
                {inscripciones.map((inscripcion) => (
                  <NavDropdown.Item
                    key={inscripcion.id}
                    onClick={() => handleSelectedInscripcion(inscripcion.id)}
                    className="text-dark"
                  >
                    {inscripcion.servicio.nombre}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>

        <div className="d-flex align-items-center">
          <Dropdown align="end">
            <Dropdown.Toggle id="dropdown-profile" style={{ background: "none", border: "none", padding: "0", cursor: "pointer" }}>
              <img src={usuario?.usuario.fotoPerfilURL || profileImg} alt="Profile" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", backgroundColor: "gray" }} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate(`/alumno/${idAlumno}/perfil/ver-perfil`)}>Ver perfil</Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/")}>Cerrar sesión</Dropdown.Item>
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

export default NavbarAlumnoDash;