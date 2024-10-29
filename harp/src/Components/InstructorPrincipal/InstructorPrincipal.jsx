import React, { useState } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import General from "./DashBoard/General.jsx";
import Alumnos from "./DashBoard/Alumnos/Alumnos.jsx";
import Cuotas from "./DashBoard/Cuotas/Cuotas.jsx";
import Asistencias from "./DashBoard/Asistencias/Asistencias.jsx";
import Configuracion from "./DashBoard/Configuracion/Configuracion.jsx";
import Estadisticas from "./DashBoard/Estadisticas.jsx";
import DetalleCuota from "./DashBoard/Cuotas/DetalleCuota.jsx";
import NavbarInstructor from "./NavbarInstructorPrincipal/NavbarInstructorPrincipal.jsx";
import Sidebar from "./SideBar/SideBar.jsx";
import Servicio from "./Servicios/MisServicios.jsx";
import SeleccionarDeCategorias from "./Servicios/SeleccionDeCategorias.jsx";
import CrearServicio from "./Servicios/CrearServicio/CrearServicio.jsx";

const InstructorPrincipal = () => {
  const { idInstructor } = useParams();
  const [selectedService, setSelectedService] = useState("Servicio-Actualizado");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <div className="d-flex flex-column flex-md-row" style={{ height: "100vh" }}>
      {/* Navbar */}
      <NavbarInstructor toggleSidebar={toggleSidebar} />

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        {isSidebarVisible && (
          <div
            className="d-none d-md-block" // Ocultar en pantallas pequeñas
            style={{
              width: "15vw",
              backgroundColor: "#f8f9fa",
              position: "relative",
              zIndex: 2,
              padding: "1rem", // Espaciado interno
            }}
          >
            <Sidebar selectedService={selectedService} isSidebarVisible={isSidebarVisible} />
          </div>
        )}

        <div className="flex-grow-1" style={{ overflowY: "auto" }}>
          <Routes>
            <Route path="servicio/crear-servicio/formulario" element={<CrearServicio />} />
            <Route path="servicio/crear-servicio" element={<SeleccionarDeCategorias />} />
            <Route path="general" element={<General />} />
            <Route path="servicio" element={<Servicio />} />
            <Route path="alumnos" element={<Alumnos service={selectedService} />} />
            <Route path="cuotas" element={<Cuotas service={selectedService} idInstructor={undefined} />} />
            <Route path="cuotas/detalle-cuota/:cuotaId" element={<DetalleCuota />} />
            <Route path="asistencias" element={<Asistencias service={selectedService} />} />
            <Route path="configuracion" element={<Configuracion service={selectedService} />} />
            <Route path="estadisticas" element={<Estadisticas service={selectedService} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default InstructorPrincipal;
