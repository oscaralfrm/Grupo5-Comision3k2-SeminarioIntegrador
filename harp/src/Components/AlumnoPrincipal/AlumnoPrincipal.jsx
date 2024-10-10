import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './SideBar/Sidebar';
import General from './Dashboard/General';
import Cursos from './Dashboard/Cursos'; // Asegúrate de tener este componente creado
import Pagos from './Dashboard/Pagos'; // Asegúrate de tener este componente creado
import Asistencias from './Dashboard/Asistencias'; // Este componente puede seguir siendo útil para alumnos
import Reseñas from './Dashboard/Reseñas'; // Asegúrate de tener este componente creado
import MisCursos from './Dashboard/MisCursos';

const AlumnoPrincipal = () => {
    const idAlumno = useParams(); // Cambié el nombre de idInstructor a idAlumno
    const [selectedService, setSelectedService] = useState('Servicio Actual');
    const navigate = useNavigate(); // Usar el hook useNavigate

    // Efecto que se activa cuando selectedService cambia
    useEffect(() => {
        navigate(`/alumno/${idAlumno}/${selectedService.replace(" ", "-")}/general`); // Ajusta la ruta a /alumno
    }, [selectedService]); // Dependencia de selectedService

    // Método para cambiar el servicio y navegar
    const handleOpcionChange = (opcion) => {
        navigate(`/alumno/${idAlumno}/${selectedService.replace(" ", "-")}/${opcion.toLowerCase()}`); // Ajusta la ruta a /alumno
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
        <div className="flex-grow-1" style={{ flex: 1, padding: '100px', overflowY: 'auto' }}>
          <Routes>
            <Route path=":selectedService/general" element={<General service={selectedService} />} />
            <Route path=":selectedService/cursos" element={<Cursos service={selectedService} />} />
            <Route path=":selectedService/pagos" element={<Pagos service={selectedService} />} />
            <Route path=":selectedService/asistencias" element={<Asistencias service={selectedService} />} />
            <Route path=":selectedService/reseñas" element={<Reseñas service={selectedService} />} />
            <Route path=":selectedService/mis-cursos" element={<MisCursos service={selectedService}/>} />
          </Routes>
        </div>
      </div>
    );
};

export default AlumnoPrincipal;

