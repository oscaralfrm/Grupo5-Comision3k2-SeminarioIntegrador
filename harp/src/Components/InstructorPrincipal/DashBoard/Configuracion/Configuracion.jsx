import React from 'react';
import Sidebar from '../../SideBar/SideBar.jsx';

const Configuracion = ({ service, isSidebarVisible }) => {
    return (   
        <div className="d-flex" style={{ height: "100vh" }}>
            {/* Sidebar */}
            {isSidebarVisible && (
                <div
                    style={{
                        width: "15vw",
                        height: "100vh",
                        position: "absolute", // Sidebar sobre el contenido, no lo mueve
                        zIndex: 2, // Asegura que el sidebar quede sobre el contenido
                        marginLeft: "0.8vw",
                        marginTop: "2vw",
                    }}
                >
                    <Sidebar />
                </div>
            )}
            {/* Contenido Principal */}
            <div 
                className="d-flex flex-column align-items-center justify-content-center" 
                style={{ width: '100%', marginLeft: isSidebarVisible ? '15vw' : '0' }} // Ajusta el margen si el sidebar está visible
            >
                <h1 className="text-center mb-4">Configuración de {service}</h1>
                {/* Aquí puedes agregar más contenido relacionado con la configuración */}
            </div>
        </div>
    );
};

export default Configuracion;
