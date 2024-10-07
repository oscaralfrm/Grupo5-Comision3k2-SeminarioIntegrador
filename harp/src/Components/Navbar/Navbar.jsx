import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import LogoHarp from '../../assets/LogoHarp.png';

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg" style={{ width: '100vw' }}>
        <div className="container-fluid ms-4">
          <Link className="navbar-brand" to="/" style={{ color: 'white' }}>
            <img src={LogoHarp} alt="Logo" />
          </Link>
          <button 
            className="navbar-toggler"
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon custom-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link ms-3" to="/servicios" style={{ color: 'white', fontSize: "1.5rem" }}>
                  <strong>Servicios</strong>
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="btn btn-outline-light me-4" to="/login" style={{ color: 'white', fontSize: "1.5rem", backgroundImage: "linear-gradient(135deg, #1E1B4B, #4F46E5)" }}>
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="btn btn-inline-light me-5" to="/registrarse" style={{ color: 'white', fontSize: "1.5rem", backgroundImage: "linear-gradient(135deg, #1E1B4B, #4F46E5)" }}>
                  Regístrate
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
