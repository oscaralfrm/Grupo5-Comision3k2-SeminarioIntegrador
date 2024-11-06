import React, { useState } from 'react';
import NavbarInstructor from './NavbarInstructor/NavbarInstructor';
import Sidebar from './SidebarInstructor/SidebarInstructor';

export default function MiServicio() {
  const [isSidebarVisible, setSidebarVisible] = useState(false); // Estado para manejar la visibilidad del sidebar

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* Navbar */}
      <NavbarInstructor toggleSidebar={toggleSidebar} />

      {/* Sidebar: Se muestra solo si isSidebarVisible es true */}
      <Sidebar idInstructor={1} isSidebarVisible={isSidebarVisible} />

      {/* Contenido principal */}
      <div
        style={{
          marginLeft: isSidebarVisible ? '250px' : '0', // Ajusta el espacio del contenido según la visibilidad del sidebar
          transition: 'margin-left 0.3s', // Animación de transición suave
        }}
      >
        {/* Aquí agregas el contenido principal de la página */}
      </div>
    </div>
  );
}
