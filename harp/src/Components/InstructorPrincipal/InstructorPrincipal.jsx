import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './SideBar/SideBar';
import General from './DashBoard/General';
import Alumnos from './DashBoard/Alumnos/Alumnos';
import Cuotas from './DashBoard/Cuotas/Cuotas';
import Asistencias from './DashBoard/Asistencias/Asistencias';
import Configuracion from './DashBoard/Configuracion/Configuracion';
import Estadisticas from './DashBoard/Estadisticas';
import DetalleCuota from './DashBoard/Cuotas/DetalleCuota';
// import CrearServicio from '../CrearServicio/CrearServicio';

const InstructorPrincipal = () => {
    const idInstructor = useParams();
    const [selectedService, setSelectedService] = useState('Servicio Actual');
    const navigate = useNavigate(); // Usar el hook useNavigate

    // Efecto que se activa cuando selectedService cambia
    useEffect(() => {
        // Esto puede ser útil para hacer algún efecto secundario o navegar
        navigate(`/instructor/${idInstructor}/${selectedService.replace(" ", "-")}/general`);
    }, [selectedService]); // Dependencia de selectedService

    // Método para cambiar el servicio y navegar
    const handleOpcionChange = (opcion) => {
        //setSelectedService(service);
        navigate(`/instructor/${idInstructor}/${selectedService.replace(" ", "-")}/${opcion.toLowerCase()}`); // Navega a la ruta correspondiente
    };

    return (
      <div className="d-flex" style={{ overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar 
          onOpcionChange={handleOpcionChange} 
          selectedService={selectedService} 
          setSelectedService={setSelectedService} 
        />

        {/* Contenedor del contenido principal */}
        <div className="flex-grow-1" style={{ flex: 1, padding: '10vw', overflowY: 'auto' }}>
          <Routes>
            <Route path=":selectedService/general" element={<General service={selectedService} />} />
            <Route path=":selectedService/alumnos" element={<Alumnos service={selectedService} />} />
            <Route path=":selectedService/cuotas" element={<Cuotas service={selectedService} />} />
            <Route path=":selectedService/cuotas/detalle-cuota/:cuotaId" element={<DetalleCuota/>}></Route>
            <Route path=":selectedService/asistencias" element={<Asistencias service={selectedService} />} />
            <Route path=":selectedService/configuracion" element={<Configuracion service={selectedService} />} />
            <Route path=":selectedService/estadisticas" element={<Estadisticas service={selectedService} />} />
            {/* <Route path="crearServicio" element={<CrearServicio/>}/> */}
            
          </Routes>
        </div>
      </div>
    );
  };
  
  export default InstructorPrincipal;