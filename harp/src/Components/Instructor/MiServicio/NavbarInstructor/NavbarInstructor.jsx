import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavbarInstructor({ toggleSidebar }) {
  const [selectedService, setSelectedService] = useState('Yoga Adultos');
  const navigate = useNavigate();

  const handleServiceChange = (service) => {
    setSelectedService(service);
    // Lógica para redirigir al seleccionar un servicio
    if (service === 'Yoga Adultos') {
      navigate('/instructor/servicio/yoga-adultos');
    } else if (service === 'Entrenamiento Funcional') {
      navigate('/instructor/servicio/entrenamiento-funcional');
    } else if (service === 'Yoga Jóvenes') {
      navigate('/instructor/servicio/yoga-jovenes');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        {/* Botón de menú visible en pantallas grandes y pequeñas */}
        <button
          className="navbar-toggler d-flex align-items-center"
          type="button"
          onClick={toggleSidebar} // Esto debe cambiar el estado de la visibilidad del sidebar
          aria-controls="sidebar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Logo */}
        <h1 className="navbar-brand mx-auto">Harp</h1>

        {/* Selector de servicio en el navbar */}
        <select
          className="form-select w-auto"
          value={selectedService}
          onChange={(e) => handleServiceChange(e.target.value)}
        >
          <option value="Yoga Adultos">Yoga Adultos</option>
          <option value="Entrenamiento Funcional">Entrenamiento Funcional</option>
          <option value="Yoga Jóvenes">Yoga Jóvenes</option>
        </select>
      </div>
    </nav>
  );
}

export default NavbarInstructor;
