import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Dropdown, Container } from "react-bootstrap";
import img from "../../../assets/LogoHarp420.png"; // Ruta del logo
import profileImg from "../../../assets/profile.png"; // Ruta de la imagen de perfil

export default function NavbarAlumnoAtras({usuario}) {
  const navigate = useNavigate();
  const { idAlumno } = useParams();
  
  const handleClick = () => {
    navigate('/');
  };

  const handleBackClick = () => {
      navigate(-1);
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <Navbar
        expand="lg"
        style={{
          backgroundColor: "#1E1B4B",
          padding: "0.5rem 1rem",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1040,
        }}
      >
          {/* Flecha de regreso */}
          <button
            className="btn"
            onClick={handleBackClick}
            style={{
              border: "none",
              background: "none",
              boxShadow: "none",
              padding: "0",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            aria-label="Back"
          >
            <i
              className="bi bi-arrow-left"
              style={{
                fontSize: "1.5rem",
                color: "white",
                pointerEvents: "none",
              }}
            ></i>
          </button>

        <Container fluid className="d-flex justify-content-between align-items-center">
          {/* Logo de Harp */}
          <Navbar.Brand
            className="d-flex align-items-center"
            style={{ marginRight: "auto", cursor: "pointer" }}
            onClick={handleClick}
          >
            <img
              src={img}
              alt="App Logo"
              width="130"
              style={{
                height: "auto",
                maxWidth: "100%",
              }}
            />
          </Navbar.Brand>

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
                src={usuario?.usuario?.fotoPerfilURL ||  profileImg}
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
              <Dropdown.Item onClick={() => navigate(`/alumno/${idAlumno}/perfil/ver-perfil`)}>
                Ver perfil
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/")}>Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>
    </div>
  );
}
