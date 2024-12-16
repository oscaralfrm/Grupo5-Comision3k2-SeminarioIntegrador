import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Navbar from '../PaginaDeInicio/NavbarLandingPage/NavbarLandingPage.jsx';
import NavbarInstructor from '../Instructor/MiServicio/NavbarInstructor/NavbarInstructor.jsx';
import NavbarRegisterChooser from '../RegistroSesion/NavbarRegistrerChooser/NavbarRegisterChooser.jsx';
import NavbarServicio from '../Instructor/MiServicio/NavbarInstructor/NavbarServicios/NavbarServicio.jsx';

const AppNavbar = () => {
  const location = useLocation();
  const { idServicio } = useParams();

  // Define las rutas que mostrarán cada navbar
  const isPrincipalRoute = location.pathname === '/';
  const isInstructorRoute = location.pathname.startsWith('/instructor');
  const isServicioRoute = location.pathname.includes('/servicio');
  const isRegisterRoute = location.pathname.startsWith('/registro');
  const isLoginRoute = location.pathname.startsWith('/login');

  return (
    <>      
      {/* Muestra la Navbar de inicio solo en la ruta principal */}
      {isPrincipalRoute && <Navbar />}
      
      {/* Muestra la Navbar del instructor solo si estamos en una ruta de instructor (esto cubre cualquier ruta bajo /instructor) */}
      {isInstructorRoute && <NavbarInstructor />}
      
      {/* Muestra la NavbarServicio solo si estamos en una ruta de servicio (no puede estar en /instructor) */}
      {isServicioRoute && !isInstructorRoute && <NavbarServicio />}
      
      {/* Muestra NavbarRegisterChooser solo si no estamos en una ruta de instructor */}
      {(!isInstructorRoute && isRegisterRoute) && <NavbarRegisterChooser />}
      {(!isInstructorRoute && isLoginRoute) && <NavbarRegisterChooser />}
    </>
  );
};

export default AppNavbar;