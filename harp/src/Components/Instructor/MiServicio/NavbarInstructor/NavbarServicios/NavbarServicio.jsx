import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import img from '../../../../../assets/LogoHarp420.png';

export default function NavbarServicio() {
  const navigate = useNavigate();
  
  return (
    <Navbar expand="lg" style={{ backgroundColor: '#1E1B4B', padding: '0 1rem' }}>
      {/* Flecha de regreso */}
      <button
        className="btn d-lg-flex justify-content-center align-items-center"
        onClick={() => window.history.back()}
        style={{
          border: 'none',
          background: 'none',
          padding: '0',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          position: 'absolute',
          left: '1rem',
          zIndex: 1, // Aseguramos que el botón esté por encima de otros elementos
        }}
        aria-label="Back"
      >
        <i className="bi bi-arrow-left" style={{ fontSize: '1.5rem', color: 'white' }}></i>
      </button>

      {/* Logo centrado */}
      <Navbar.Brand className="mx-auto" style={{ flexGrow: 1, textAlign: 'center' }}>
        <img
          src={img}
          alt="App Logo"
          style={{ width: '130px', height: 'auto' }}
          className="d-inline-block align-top"
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbar-nav" className="border-0">
        <div style={{
          width: '25px',
          height: '3px',
          backgroundColor: 'white',
          margin: '5px 0',
        }}></div>
        <div style={{
          width: '25px',
          height: '3px',
          backgroundColor: 'white',
          margin: '5px 0',
        }}></div>
        <div style={{
          width: '25px',
          height: '3px',
          backgroundColor: 'white',
          margin: '5px 0',
        }}></div>
      </Navbar.Toggle>

      <Navbar.Collapse id="navbar-nav" className="justify-content-end">
        <Nav>
          <Button
            style={{
              backgroundColor: '#4F46E5',
              color: 'white',
              border: 'none',
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
            className="mb-2 mb-sm-0"
          >
            Cerrar Sesión
          </Button>
        </Nav>
      </Navbar.Collapse>

      {/* Estilos Adicionales */}
      <style>
        {`
          .navbar {
            width: 100%;
          }

          @media (max-width: 992px) {
            .navbar-toggler-icon {
              background-image: none;
            }
          }

          @media (max-width: 768px) {
            .navbar-brand {
              position: static;
              transform: none;
              text-align: center;
              width: 100%; // Asegurar que ocupe todo el ancho
            }

            .btn {
              position: static;
              transform: none;
              margin-bottom: 10px;
              width: 100%; // Asegurar que ocupe todo el ancho
            }
          }

          @media (max-width: 300px) {
            .navbar {
              padding: 0; // Ajustes adicionales para pantallas muy pequeñas
            }
          }
        `}
      </style>
    </Navbar>
  );
}