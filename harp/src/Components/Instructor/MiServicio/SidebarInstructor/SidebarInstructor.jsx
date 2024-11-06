import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaHome, FaChalkboardTeacher, FaUserGraduate, FaMoneyBillWave } from 'react-icons/fa'; // Íconos de react-icons
import { Link } from 'react-router-dom'; // Para las rutas de React Router

const CustomSidebar = ({idServicio,idInstructor}) => {
  return (
    <Sidebar
      style={{
        position: 'fixed',
        top: '8.2vh',  // Ajustado para estar debajo de la navbar
        left: '0',    // Fijado a la izquierda
        width: '250px',  // Ancho fijo del sidebar
        height: '87vh',  // Alto adaptado al tamaño de la pantalla
        backgroundColor: '#E6E6FA',  // Fondo claro para el sidebar
        fontFamily: 'Roboto, sans-serif', // Usar fuente Roboto
        zIndex: '1050'  // Asegurar que el sidebar esté por encima del contenido
      }}
    >
      <Menu>
        <MenuItem icon={<FaHome />} style={{ fontSize: '1rem' }}>
          <Link to={`/instructor/${idInstructor}/servicio/${idServicio}/general`} style={{ textDecoration: 'none', color: 'black' }}>General</Link>
        </MenuItem>
        <MenuItem icon={<FaChalkboardTeacher />} style={{ fontSize: '1rem' }}>
          <Link to={`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`} style={{ textDecoration: 'none', color: 'black' }}>Mi Servicio</Link>
        </MenuItem>
        <MenuItem icon={<FaUserGraduate />} style={{ fontSize: '1rem' }}>
          <Link to={`/instructor/${idInstructor}/servicio/${idServicio}/alumnos`} style={{ textDecoration: 'none', color: 'black' }}>Alumnos</Link>
        </MenuItem>
        <MenuItem icon={<FaMoneyBillWave />} style={{ fontSize: '1rem' }}>
          <Link to={`/instructor/${idInstructor}/servicio/${idServicio}/cobros`} style={{ textDecoration: 'none', color: 'black' }}>Cobros</Link>
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default CustomSidebar;
