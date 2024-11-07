import React from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from '../PaginaDeInicio/NavbarLandingPage/NavbarLandingPage.jsx'
import NavbarInstructor from '../Instructor/MiServicio/NavbarInstructor/NavbarInstructor.jsx'


const AppNavbar = () => {
  const location = useLocation();

  // Define las rutas que mostrarán cada navbar
  const isPrincipalRoute = location.pathname === '/';
  const isInstructorRoute = location.pathname.startsWith('/instructor/') &&
  location.pathname.includes('/servicio/');
  return (
    <>
      {isPrincipalRoute && <Navbar />}
      {isInstructorRoute && <NavbarInstructor />}
    </>
  );
};

export default AppNavbar;
