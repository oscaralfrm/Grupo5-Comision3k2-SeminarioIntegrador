import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Navbar, Dropdown } from "react-bootstrap";
import img from "../../assets/LogoHarp420.png"; // Ruta del logo
import profileImg from "../../assets/profile.png"; // Ruta de la imagen de perfil

export default function NavbarSimple({usuario}) {
  const navigate = useNavigate();
  const {idInstructor} = useParams();
  const location = useLocation();
  const handleLogoClick = () => {
    navigate("/");
  };

  const handleBackClick = () => {
    console.log("ruta", location.state?.from );
    if (location.state?.from === `/instructor/${idInstructor}/crear-servicio`) {
      navigate(`/instructor/${idInstructor}/servicios`);
    } else if (location.state?.from === `/instructor/${idInstructor}/editar-servicio`){
      navigate(`/instructor/${idInstructor}/servicios`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div style={{ width: "100%", position: "relative", alignItems: "center" }}>
      <Navbar
        expand="lg"
        style={{
          backgroundColor: "#1E1B4B",
          padding: ".5rem 1rem",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1040, // Altura dinámica de la navbar
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
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

          {/* Logo centrado */}
          <div
            onClick={handleLogoClick}
            style={{
              cursor: "pointer",
            }}
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
          </div>

          {/* Menú de perfil */}
          <Dropdown align="end" style={{ height: "3rem" }}>
            <Dropdown.Toggle
              id="dropdown-profile"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 0,
              }}
            >
              <img
                src={usuario?.usuario?.fotoPerfilURL || profileImg}
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
            <Dropdown.Menu style={{marginTop:".8rem",}}>
              <Dropdown.Item
                onClick={() => navigate(`/instructor/${idInstructor}/perfil/ver-perfil`)}
              >
                Ver perfil
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/")}>
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Navbar>
    </div>
  );
}
