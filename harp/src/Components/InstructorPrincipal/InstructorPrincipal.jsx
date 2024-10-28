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

const InstructorPrincipal = () => {
  const { idInstructor } = useParams();
  const [selectedService, setSelectedService] = useState("Servicio-Actualizado");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <div className="d-flex" style={{ position: "relative", overflow: "hidden", height: "100vh" }}>
      <div className="flex-grow-1">
        <NavbarInstructor toggleSidebar={toggleSidebar} />
        <div className="d-flex" style={{ height: "100vh", position: "relative" }}>
          {/* Sidebar */}
          {isSidebarVisible && (
            <div
              style={{
                width: "15vw",
                height: "100vh",
                backgroundColor: "#f8f9fa", // Cambiado a un color fijo
                position: "absolute",
                zIndex: 2,
                marginLeft: "0.8vw",
                marginTop: "1vw",
              }}
            >
              <Sidebar
                selectedService={selectedService}
                isSidebarVisible={isSidebarVisible}
              />
            </div>
          )}
          <div style={{ marginLeft: '0', width: '100%' }}>
            <Routes>
              <Route path="general" element={<General />} />
              <Route path="alumnos" element={<Alumnos service={selectedService} />} />
              <Route path="cuotas" element={<Cuotas service={selectedService} idInstructor={undefined}/>} />
              <Route path="cuotas/detalle-cuota/:cuotaId" element={<DetalleCuota />} />
              <Route path="asistencias" element={<Asistencias service={selectedService} />} />
              <Route path="configuracion" element={<Configuracion service={selectedService} />} />
              <Route path="estadisticas" element={<Estadisticas service={selectedService} />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorPrincipal;
