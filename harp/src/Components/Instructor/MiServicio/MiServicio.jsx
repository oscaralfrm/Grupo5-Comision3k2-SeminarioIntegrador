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
      {isSidebarVisible && (
        
          <Sidebar />
        
      )}


    </div>
  );
}
