import React from "react";
import { Navbar, Button } from "react-bootstrap";
import img from "../../../assets/LogoHarp420.png";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <Navbar
      expand="lg"
      className="px-4"
      style={{
        fontFamily: "Roboto",
        backgroundColor: "#1E1B4B",
        minHeight: "10vh",
      }}
    >
      <div className="container-fluid d-flex align-items-center">
        <Navbar.Brand href="#" className="text-white">
          <img
            src={img}
            alt="Harp Logo"
            width="130"
            height="auto"
            className="d-inline-block align-top "
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbar-nav"
          style={{
            borderColor: "grey",
            backgroundColor: "#1E1B4B",
          }}
          className="navbar navbar-dark"
        />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <div
            className="d-flex align-items-center ms-auto"
            style={{ gap: "0.5rem" }} // Espaciado entre botones
          >
            <Button
              style={{ fontSize: "1.2rem" }}
              variant="outline-light"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </Button>
            <Button
              style={{
                backgroundColor: "#4F46E5",
                color: "white",
              }}
              onClick={() => navigate("/registro")}
            >
              Regístrate
            </Button>
          </div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
