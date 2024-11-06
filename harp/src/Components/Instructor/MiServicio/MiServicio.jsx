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
        
          <Sidebar />
        
      )}


    </div>
  );
}
