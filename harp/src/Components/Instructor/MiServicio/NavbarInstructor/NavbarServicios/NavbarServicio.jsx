import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Dropdown } from "react-bootstrap";
import img from "../../../../../assets/LogoHarp420.png"; // Ruta del logo
import profileImg from "../../../../../assets/profile.png"; // Ruta de la imagen de perfil

export default function NavbarServicio() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  }
  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: "#1E1B4B",
        padding: "0.5rem 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Logo de Harp */}
      <Navbar.Brand
      className="d-flex align-items-center"
      style={{ marginRight: "auto" }}
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
          <Dropdown.Item onClick={() => navigate("/editar-perfil")}>
            Editar perfil
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/")}>
            Cerrar sesión
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Navbar>
  );
}
