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
        position: 'relative', // Se agrega para controlar la posición de los elementos hijos
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
          position: 'absolute',
          left: '1rem', // Se posiciona a la izquierda en todo momento
        }}
        aria-label="Back"
      >
        <i
          className="bi bi-arrow-left"
          style={{ fontSize: '1.5rem', color: 'white' }}
        ></i>
      </button>

      {/* Contenedor para centrar la imagen */}
      <a
        className="navbar-brand mx-auto"
        href="/"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <img
          src={img}
          alt="App Logo"
          style={{ width: '130px', height: 'auto' }}
          className="d-inline-block align-top"
        />
      </a>

      {/* Botón de Cerrar Sesión alineado a la derecha */}
      <button
        style={{
          backgroundColor: '#4F46E5',
          color: 'white',
          border: 'none',
          fontSize: '1rem',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          position: 'absolute',
          right: '1rem', // Alineación a la derecha
        }}
        onClick={() => navigate('/')}
        className="mb-2 mb-sm-0"
      >
        Cerrar Sesión
      </button>

      {/* Media Queries para hacer la navbar responsive */}
      <style>
        {`
          /* Puntos de quiebre para dispositivos móviles */
          @media (max-width: 576px) { 
            .navbar { flex-direction: column; align-items: center; justify-content: center; }
            .navbar-brand { margin-bottom: 10px; }
            .btn { margin-top: 10px; }
          }

          /* Puntos de quiebre para tabletas pequeñas */
          @media (min-width: 577px) and (max-width: 767px) {
            .navbar { flex-direction: column; align-items: center; justify-content: center; }
            .navbar-brand { margin-bottom: 10px; }
            .btn { margin-top: 10px; }
          }

          /* Puntos de quiebre para tabletas */
          @media (min-width: 768px) and (max-width: 991px) { 
            .navbar { flex-direction: row; justify-content: space-between; }
            .navbar-brand { margin-bottom: 0; }
            .btn { margin-top: 0; }
          }

          /* Puntos de quiebre para computadoras pequeñas */
          @media (min-width: 992px) and (max-width: 1199px) {
            .navbar { flex-direction: row; justify-content: space-between; }
          }

          /* Puntos de quiebre para computadoras grandes */
          @media (min-width: 1200px) { 
            .navbar { flex-direction: row; justify-content: space-between; }
          }
        `}
      </style>
    </nav>
  );
}
