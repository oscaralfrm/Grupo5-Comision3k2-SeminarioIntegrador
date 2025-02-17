import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import img from "../../assets/LogoHarp420.png";
import profileImg from "../../assets/profile.png";
import { getInscripcionesDeAlumno } from "../../services/Alumno";
import { MdFavorite } from "react-icons/md";
import { motion } from "framer-motion";



function NavbarGeneralAlumno({ inscripcionesConCuotas, usuario }) {
    const navigate = useNavigate();
    const { idAlumno } = useParams();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hovered, setHovered] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
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
                            href={`/alumno/${idAlumno}/inscripciones`}
                            style={{ color: "white" }}
                        >
                            Mis Inscripciones
                        </Nav.Link>
                        {inscripcionesConCuotas &&
                            <Nav.Link
                                href={`/alumno/${idAlumno}/inscripciones/pagos`}
                                style={{ color: "white" }}
                            >
                                Pagos
                            </Nav.Link>
                        }
                        <Nav.Link
                            href={`/alumno/${idAlumno}/descubrir-servicios`}
                            style={{ color: "white" }}
                        >
                            Descubrir
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>

                <div className="d-flex align-items-center">
                    {/* Ícono de corazón para acceder a servicios favoritos */}
                    <motion.span
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        initial={{ scale: 1 }}
                        animate={{ scale: hovered ? 1.2 : 1 }}
                        transition={{ duration: 0.3 }}
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", 
                            cursor: "pointer",
                            margin: "0 15px"}}
                    >
                     <MdFavorite
                        size={30}
                        color="white"
                        onClick={()  => navigate(`/alumno/${idAlumno}/servicios-favoritos`) } 
                        
                    />  
                    </motion.span>

                    <Dropdown align="end">
                        <Dropdown.Toggle id="dropdown-profile" style={{ background: "none", border: "none", padding: "0", cursor: "pointer" }}>
                            <img src={usuario?.usuario?.fotoPerfilURL || profileImg} alt="Profile" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", backgroundColor: "gray" }} />
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

export default NavbarGeneralAlumno;