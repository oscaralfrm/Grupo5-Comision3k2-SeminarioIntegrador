import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Navbar, Dropdown } from "react-bootstrap";
import img from "../../assets/LogoHarp420.png"; // Ruta del logo
import profileImg from "../../assets/profile.png"; // Ruta de la imagen de perfil
import { FaExclamationCircle } from "react-icons/fa";
import { tieneDatosBancariosCompletos } from "../../services/Instructor";

export default function NavbarMisServicios() {
  const navigate = useNavigate();
  const { idInstructor } = useParams();
  const location = useLocation();

  const [instructor, setInstructor] = useState(null);
  const [tieneDatosCompletos, setTieneDatosCompletos] = useState(null);

  const esteInstructorTieneDatosCompletos = async () => {
    const response = await tieneDatosBancariosCompletos(idInstructor);
    return response;
  }

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


  const handleLogoClick = () => {
    navigate("/");
  };

  const handleMisServiciosClick = () => {
    navigate(`/instructor/${idInstructor}/servicios`);
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
          {/* Botón "Mis Servicios" */}
          <button
            className="btn"
            onClick={handleMisServiciosClick}
            style={{
              border: "none",
              background: "none",
              boxShadow: "none",
              padding: "0",
              width: "auto",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              color: "white",
              fontSize: "1rem",
            }}
            aria-label="Mis Servicios"
          >
            Mis Servicios
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
            <Dropdown.Menu style={{ marginTop: ".8rem" }}>
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