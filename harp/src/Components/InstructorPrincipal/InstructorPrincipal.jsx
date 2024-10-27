import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from "react-router-dom";
import General from "./DashBoard/General";
import Alumnos from "./DashBoard/Alumnos/Alumnos";
import Cuotas from "./DashBoard/Cuotas/Cuotas";
import Asistencias from "./DashBoard/Asistencias/Asistencias";
import Configuracion from "./DashBoard/Configuracion/Configuracion";
import Estadisticas from "./DashBoard/Estadisticas";
import DetalleCuota from "./DashBoard/Cuotas/DetalleCuota";
import NavbarInstructor from "./NavbarInstructorPrincipal/NavbarInstructorPrincipal";

const InstructorPrincipal = () => {
  const { idInstructor } = useParams();
  const [selectedService, setSelectedService] = useState('Servicio-Actualizado');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const navigate = useNavigate();



  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <div className="d-flex" style={{ position: "relative", overflow: "hidden", height: "100vh" }}>
      {/* Renderizando solo una vez el Sidebar */}

      <div className="flex-grow-1">
        <NavbarInstructor
          toggleSidebar={toggleSidebar}
        />
        <Routes>
        <Route path="general" element ={<General service={selectedService} isSidebarVisible={isSidebarVisible}  />} />
          <Route path="alumnos" element ={<Alumnos service={selectedService} isSidebarVisible={isSidebarVisible}/>} />
          <Route path="cuotas" element ={<Cuotas service={selectedService} isSidebarVisible={isSidebarVisible}  />} />
          <Route path="cuotas/detalle-cuota/:cuotaId" element={<DetalleCuota isSidebarVisible={isSidebarVisible}/>} />
          <Route path="asistencias" element={<Asistencias service={selectedService} isSidebarVisible={isSidebarVisible} />} />
          <Route path="configuracion" element={<Configuracion service={selectedService} isSidebarVisible={isSidebarVisible}/>} />
          <Route path="estadisticas" element={<Estadisticas service={selectedService} />} />
        </Routes>
      </div>
    </div>
  );
};

export default InstructorPrincipal;
