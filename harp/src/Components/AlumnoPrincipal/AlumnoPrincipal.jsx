import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './SideBar/Sidebar';
import GeneralStudent from './Dashboard/General';
import Pagos from './Dashboard/Pagos';
import Asistencias from './Dashboard/Asistencias';
import Reseñas from './Dashboard/Reseñas';
import MisCursos from './Dashboard/MisCursos';
import DetalleCurso from './Cursos/DetalleCurso'; // Asegúrate de que esto esté presente

const AlumnoPrincipal = () => {
    const { idAlumno } = useParams(); 
    const [selectedService, setSelectedService] = useState('general'); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!idAlumno) {
            navigate('/error'); // Redirige si no hay idAlumno
        } else {
            if (!selectedService) {
                navigate(`/alumno/${idAlumno}/general`);
            }
        }
    }, [selectedService, idAlumno, navigate]);

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
                    <Route path="mis-cursos/:idCurso" element={<DetalleCurso />} /> {/* Ruta para el detalle del curso */}
                </Routes>
            </div>
        </div>
    );
};

export default AlumnoPrincipal;

