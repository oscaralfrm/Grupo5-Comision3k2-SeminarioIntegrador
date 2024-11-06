import React, { useState } from 'react';
import NavbarInstructor from './NavbarInstructor/NavbarInstructor.jsx';
import Sidebar from './SidebarInstructor/SidebarInstructor.jsx';

export default function MiServicio() {
  const [isSidebarVisible, toggleSidebar] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* Navbar */}
      <NavbarInstructor toggleSidebar={() => toggleSidebar(prev => !prev)} />

      {/* Sidebar: Se muestra solo si isSidebarVisible es true */}
      {isSidebarVisible && (
        <div style={{ marginTop: '10vh' }}>
          <Sidebar />
        </div>
      )}

      {/* Contenido principal */}
      <div
        style={{
          marginLeft: isSidebarVisible ? '15vw' : '0', // Ajusta el espacio del contenido según la visibilidad del sidebar
          transition: 'margin-left 0.3s', // Animación de transición suave
        }}
      >
        {/* Aquí agregas el contenido principal de la página */}
      </div>
    </div>
  );
}
