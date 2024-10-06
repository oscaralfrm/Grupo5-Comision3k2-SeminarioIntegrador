import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand "to="/" style={{color:'white'}} >Harp</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/servicios" style={{color:'white'}}>Servicios</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="btn btn-outline-light me-2" to="/login">Iniciar Sesion</Link>
            </li>
          </ul>
          <ul className="navbar-nav ">
            <li className="nav-item">
              <Link className="btn btn-inline-ligth me-2" to="/registro" style={{color:'white'}}>Registrarse</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
