import React from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../../../../../assets/LogoHarp420.png';

export default function NavbarServicio() {
  const navigate = useNavigate();

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: '#1E1B4B',
        minHeight: '10vh',
        padding: '0.5rem 1rem',
      }}
    >
      {/* Flecha de regreso */}
      <button
        className="btn d-flex justify-content-center align-items-center"
        onClick={() => window.history.back()}
        style={{
          border: 'none',
          background: 'none',
          padding: '0',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
        }}
        aria-label="Back"
      >
        <i
          className="bi bi-arrow-left"
          style={{ fontSize: '1.5rem', color: 'white' }}
        ></i>
      </button>

      {/* Logo centrado */}
      <a className="navbar-brand mx-auto" href="/">
        <img
          src={img}
          alt="App Logo"
          style={{ width: '130px', height: 'auto' }}
          className="d-inline-block align-top"
        />
      </a>

      {/* Botón de Cerrar Sesión */}
      <button
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
      </button>
    </nav>
  );
}
