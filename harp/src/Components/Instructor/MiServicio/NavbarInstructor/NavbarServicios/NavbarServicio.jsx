import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import img from "../../../../../assets/LogoHarp420.png";

function NavbarServicio() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login"); // Redirige a /login
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light fixed-top"
      style={{
        fontFamily: "Roboto",
        backgroundColor: "#1E1B4B",
        color: "white",
        width: "100%",
        height: "13vh",
        fontSize: "1.2rem",
      }}
    >
      {/* Botón de toggler en dispositivos móviles */}
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
        style={{ borderColor: "white" }}
      >
        <span
          className="navbar-toggler-icon"
          style={{ filter: "invert(1)" }}
        ></span>
      </button>

      {/* Logo visible en responsive */}
      <a className="navbar-brand d-lg-none" href="/">
        <img src={img} alt="Harp Logo" width="100" />
      </a>

      <div
        className="collapse navbar-collapse"
        id="navbarNavDropdown"
      >
        <ul className="nav">
          <li className="nav-item d-none d-lg-block">
            <a
              className="nav-link"
              href="/"
              style={{ paddingLeft: "1vw" }}
            >
              <img src={img} alt="Harp Logo" width="130" />
            </a>
          </li>
        </ul>

        <ul className="navbar-nav mx-auto"></ul>

        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              onClick={handleClick}
              style={{ color: "white" }}
            >
              Cerrar Sesión
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavbarServicio;
