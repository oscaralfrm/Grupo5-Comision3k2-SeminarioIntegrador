import React from 'react';
import img from '../../../assets/LogoHarp420.png';

export default function NavbarRegisterChooser() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#1E1B4B', height:'13vh' }}>
      {/* Flecha de regreso */}
      <button
        className="btn"
        onClick={() => window.history.back()}
        style={{
          position: 'absolute',
          left: '1rem',
          border: 'none',
          background: 'none',
          boxShadow: 'none', // Eliminar la sombra
          padding: '0', // Eliminar padding extra
          width: '40px', // Tamaño del área de clic
          height: '40px', // Asegurar que la zona de clic sea adecuada
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center', // Centrar el ícono
        }}
        aria-label="Back"
      >
        <i
          className="bi bi-arrow-left"
          style={{
            fontSize: '1.5rem',
            color: 'white',  // Hacer la flecha blanca
            textShadow: 'none', // Asegurarse de que no haya sombra en el texto del icono
          }}
        ></i>
      </button>

      {/* Logo centrado */}
      <a className="navbar-brand mx-auto" href="/">
        <img src={img} alt="App Logo" width="130" height="auto" className="d-inline-block align-top" />
      </a>
    </nav>
  );
}
