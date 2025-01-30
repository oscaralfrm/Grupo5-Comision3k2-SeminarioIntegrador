import React from "react";

const NavbarAlumno = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="#">Servicios para Alumnos</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">Mis Servicios</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Explorar</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAlumno;
