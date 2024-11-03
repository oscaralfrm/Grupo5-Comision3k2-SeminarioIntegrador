import React, { useState } from 'react';
import ServiceCreationStep1 from './ServiceCreationStep1';
// Asegúrate de importar otros pasos de servicio también

const ServiceCreation = () => {
    const [formData, setFormData] = useState({
        serviceName: '',
        category: '',
        description: '',
        logo: null,
        location: '',
    });

    const handleNext = () => {
        // Puedes manejar aquí la lógica que desees antes de pasar al siguiente paso
    };

    return (
        <div>
            <ServiceCreationStep1 formData={formData} setFormData={setFormData} onNext={handleNext} />
            {/* Aquí puedes añadir otros pasos según sea necesario */}
        </div>
    );
};

export default ServiceCreation;
