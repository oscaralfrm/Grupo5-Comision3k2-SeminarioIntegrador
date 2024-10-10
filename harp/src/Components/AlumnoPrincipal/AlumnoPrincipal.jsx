import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './SideBar/Sidebar';
import General from './Dashboard/General';
import Cursos from './Dashboard/Cursos';
import Pagos from './Dashboard/Pagos';
import Asistencias from './Dashboard/Asistencias';
import Reseñas from './Dashboard/Reseñas';
import MisCursos from './Dashboard/MisCursos';

const AlumnoPrincipal = () => {
    const idAlumno = useParams();
    const [selectedService, setSelectedService] = useState('Servicio Actual');
    const [size, setSize] = useState(63); // Inicialmente 63
    const navigate = useNavigate();

    // Efecto que se activa cuando selectedService cambia
    useEffect(() => {
        navigate(`/alumno/${idAlumno}/${selectedService.replace(" ", "-")}/general`);
    }, [selectedService]);

    // Método para cambiar el servicio y navegar
    const handleOpcionChange = (opcion) => {
        navigate(`/alumno/${idAlumno}/${selectedService.replace(" ", "-")}/${opcion.toLowerCase()}`);
    };

    // Simulación de cambio de tamaño de menú
    const handleMenuToggle = (isExpanded) => {
        setSize(isExpanded ? 55 : 63);
    };

    return (
        <div className="d-flex" style={{ overflow: 'hidden' }}>
            {/* Sidebar */}
            <Sidebar 
                onOpcionChange={handleOpcionChange} 
                selectedService={selectedService} 
                setSelectedService={setSelectedService}
                onMenuToggle={handleMenuToggle} // Pasar la función de cambio de tamaño
            />

            {/* Contenedor del contenido principal */}
            <div className="flex-grow-1" style={{ flex: 1, padding: '1vw', marginLeft:"2vw", overflowY: 'auto' }}>
                <Routes>
                    <Route path=":selectedService/general" element={<General service={{selectedService, size}} />} />
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
