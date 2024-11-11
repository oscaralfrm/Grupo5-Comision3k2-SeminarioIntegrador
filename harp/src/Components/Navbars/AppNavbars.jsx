import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Navbar from '../PaginaDeInicio/NavbarLandingPage/NavbarLandingPage.jsx'
import NavbarInstructor from '../Instructor/MiServicio/NavbarInstructor/NavbarInstructor.jsx'
import NavbarRegisterChooser from '../RegistroSesion/NavbarRegistrerChooser/NavbarRegisterChooser.jsx';
import NavbarServicio from '../Instructor/MiServicio/NavbarInstructor/NavbarServicios/NavbarServicio.jsx';


const AppNavbar = () => {
  const location = useLocation();
  const {idServicio} =useParams();
  console.log(idServicio)
  // Define las rutas que mostrarán cada navbar
  const isPrincipalRoute = location.pathname === '/';
  const isInstructorRoute = location.pathname.startsWith('/instructor/') &&
  location.pathname.includes('/servicio/');
  const isRegisterRoute = location.pathname.startsWith('/registro');
  const isLoginRoute = location.pathname.startsWith('/login')
  const isServiciosRoute = location.pathname.startsWith('/instructor/1/servicios')
  return (
    <>      
      {isPrincipalRoute && <Navbar />}
      {isInstructorRoute && <NavbarInstructor />}
      {isRegisterRoute && <NavbarRegisterChooser />}
      {isLoginRoute && <NavbarRegisterChooser />}
      {isServiciosRoute && <NavbarServicio/>}
    </>

  );
};

export default AppNavbar;
