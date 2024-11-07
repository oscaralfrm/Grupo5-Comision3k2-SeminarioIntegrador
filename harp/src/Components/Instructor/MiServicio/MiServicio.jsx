import React, { useState } from 'react';

export default function MiServicio() {
  const [isSidebarVisible, setSidebarVisible] = useState(true); // Estado para manejar la visibilidad del sidebar

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* Navbar */}


    </div>
  );
}
