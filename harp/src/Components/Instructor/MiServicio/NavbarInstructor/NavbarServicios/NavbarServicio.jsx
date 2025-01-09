import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import img from '../../../../../assets/LogoHarp420.png';

export default function NavbarServicio() {
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#1E1B4B', padding: '0.5rem 1rem', position: 'relative', width: '100vw' }}>
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
          zIndex: 1,
        }}
        aria-label="Back"
      >
        <i className="bi bi-arrow-left" style={{ fontSize: '1.5rem', color: 'white' }}></i>
      </button>

      {/* Logo centrado */}
      <Navbar.Brand
        className="mx-auto d-flex justify-content-center align-items-center"
        style={{ flexGrow: 1, position: 'relative' }}
      >
        <img
          src={img}
          alt="App Logo"
          style={{ maxWidth: '150px', height: 'auto' }}
          className="d-inline-block align-top"
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbar-nav" className="border-0">
        <span style={{ display: 'block', width: '25px', height: '3px', backgroundColor: 'white', margin: '5px 0' }}></span>
        <span style={{ display: 'block', width: '25px', height: '3px', backgroundColor: 'white', margin: '5px 0' }}></span>
        <span style={{ display: 'block', width: '25px', height: '3px', backgroundColor: 'white', margin: '5px 0' }}></span>
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

      <style>
        {`
          .navbar {
            width: 100vw;
          }

          @media (max-width: 350px) {
            .navbar {
              width: 100vw;
              padding: 0.5rem;
            }
          }

          @media (min-width: 992px) {
            .navbar-brand {
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
            }
          }

          @media (max-width: 768px) {
            .navbar-brand {
              margin: 0 auto;
              text-align: center;
            }
          }
        `}
      </style>
    </Navbar>
  );
}
