import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Dropdown, Container, Form, FormControl, Button } from "react-bootstrap";
import img from "../../../../../assets/LogoHarp420.png"; // Ruta del logo
import profileImg from "../../../../../assets/profile.png"; // Ruta de la imagen de perfil

export default function NavbarServicio() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div style={{ width: "100%" }}>
      <Navbar
        expand="lg"
        style={{
          backgroundColor: "#1E1B4B",
          padding: "0.5rem 1rem",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1040,
        }}
      >
        <Container fluid className="d-flex justify-content-between align-items-center">
          <Navbar.Brand
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
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
                src={profileImg}
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
              <Dropdown.Item onClick={() => navigate("/editar-perfil")}>Editar perfil</Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/")}>Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>

      {/* Sección "Mis Servicios" */}
      <div
        style={{
          paddingTop: "80px", // Espacio para el Navbar
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 80px)", // Ocupa el resto de la altura de la pantalla
          textAlign: "center",
          backgroundColor: "#1E1B4B", // Fondo para visualización
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "2rem", marginBottom: "1rem" }}>Mis Servicios</h1>

        {/* Barra de búsqueda */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Form style={{ width: "100%", maxWidth: "500px" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <FormControl
                type="text"
                placeholder="Buscar por nombre..."
                style={{
                  flex: 1,
                  textAlign: "center",
                  marginRight: "10px",
                }}
              />
              <Button variant="primary" type="submit">
                Buscar
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* Media Queries para pantallas pequeñas */}
      <style>
        {`
          @media (max-width: 350px) {
            h1 {
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }

            .form-control {
              font-size: 14px;
              padding: 8px;
            }

            .btn {
              padding: 8px 12px;
              font-size: 14px;
            }
          }

          @media (max-width: 600px) {
            h1 {
              font-size: 1.8rem;
              margin-bottom: 20px;
            }

            .form-control {
              width: 90%;
            }
          }
        `}
      </style>
    </div>
  );
}
