import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Navbar from '../PaginaDeInicio/NavbarLandingPage/NavbarLandingPage.jsx';
import NavbarInstructor from '../Instructor/MiServicio/NavbarInstructor/NavbarInstructor.jsx';
import NavbarRegisterChooser from '../RegistroSesion/NavbarRegistrerChooser/NavbarRegisterChooser.jsx';
import NavbarServicio from '../Instructor/MiServicio/NavbarInstructor/NavbarServicios/NavbarServicio.jsx';

const AppNavbar = () => {
  const location = useLocation();
  const { idInstructor, idServicio } = useParams();

  // Define condiciones para mostrar las Navbars
  const isPrincipalRoute = location.pathname === '/';
  const isInstructorRoute = location.pathname.startsWith(`/instructor/${idInstructor}/servicio/`);
  const isInstructorService =location.pathname === `/instructor/${idInstructor}/servicios`;
  const isCreateServiceRoute = location.pathname === `/instructor/${idInstructor}/crear-servicio`;
  const isRegisterRoute = location.pathname.startsWith('/registro');

  return (
    <>
      {/* Muestra la Navbar de inicio en la ruta principal */}
      {isPrincipalRoute && <Navbar />}

      {/* Muestra NavbarInstructor en la ruta específica del servicio */}
      {isInstructorRoute  && <NavbarInstructor />}

      {/* Muestra NavbarServicio en la ruta de creación de servicio */}
      {isCreateServiceRoute && <NavbarServicio />}
 
      {/* Muestra NavbarRegisterChooser en rutas de registro */}
      {isRegisterRoute && <NavbarRegisterChooser />}
      {isInstructorService && <NavbarServicio /> }
    </>
  );
};

export default AppNavbar;
