import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './SideBar/Sidebar';
import GeneralStudent from './Dashboard/General'; 
import Pagos from './Dashboard/Pagos';
import Asistencias from './Dashboard/Asistencias';
import Reseñas from './Dashboard/Reseñas';
import MisCursos from './Dashboard/MisCursos';

const AlumnoPrincipal = () => {
    const { idAlumno } = useParams(); 
    const [selectedService, setSelectedService] = useState('general'); 
    const navigate = useNavigate();

    useEffect(() => {
        // Cambiar la ruta predeterminada a "general" cuando se carga el componente
        if (!selectedService) {
            navigate(`/alumno/${idAlumno}/general`);
        }
    }, [selectedService, idAlumno, navigate]);

    // Método para cambiar la sección y navegar
    const handleOpcionChange = (opcion) => {
        setSelectedService(opcion); 
        navigate(`/alumno/${idAlumno}/${opcion.toLowerCase()}`);
    };

    return (
        <div className="d-flex" style={{ overflow: 'hidden' }}>
            <Sidebar 
                onOpcionChange={handleOpcionChange} 
                selectedService={selectedService} 
            />
            <div className="flex-grow-1" style={{ padding: '1vw', marginLeft: "2vw", overflowY: 'auto' }}>
                <Routes>
                    <Route path="general" element={<GeneralStudent />} />
                    <Route path="pagos" element={<Pagos />} />
                    <Route path="asistencias" element={<Asistencias />} />
                    <Route path="reseñas" element={<Reseñas />} />
                    <Route path="mis-cursos" element={<MisCursos />} />
                </Routes>
            </div>
        </div>
    );
};

export default AlumnoPrincipal;
