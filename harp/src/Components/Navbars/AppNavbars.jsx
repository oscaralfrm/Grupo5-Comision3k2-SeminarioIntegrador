import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Navbar from '../PaginaDeInicio/NavbarLandingPage/NavbarLandingPage.jsx';
import NavbarInstructor from '../Instructor/MiServicio/NavbarInstructor/NavbarInstructor.jsx';
import NavbarRegisterChooser from '../RegistroSesion/NavbarRegistrerChooser/NavbarRegisterChooser.jsx';
import NavbarServicio from '../Instructor/MiServicio/NavbarInstructor/NavbarServicios/NavbarServicio.jsx';
import NavbarSimple from './NavbarSimple.jsx';
import { IoIosLogIn } from 'react-icons/io';
import NavbarAlumno from '../Alumno/NavbarAlumno/NavbarAlumno.jsx';
import NavbarAlumnoDash from '../Alumno/NavbarAlumno/NavbarDashboard/NavbarDashboard.jsx';
import NavbarAlumnoAtras from '../Alumno/NavbarAlumno/NavbarAtras.jsx';
import NavbarAlumnoMisServicios from '../Alumno/NavbarAlumno/NavbarMisServicios.jsx';
import NavbarMisServicios from './NavbarMisServicios.jsx';
import NavbarGeneralAlumno from './NavbarGeneralAlumno.jsx';
import { getInscripcionesDeAlumno } from '../../services/Alumno.js';
import { obtenerUltimasCuotasDeInscripcion } from '../../services/Cuota.js';

const AppNavbar = () => {
  const location = useLocation();
  const { idInstructor, idServicio, idAlumno, idInscripcion } = useParams();
  const [inscripciones, setInscripciones] = useState([]);

  // Define condiciones para mostrar las Navbars
  const isPrincipalRoute = location.pathname === '/';
  const isInstructorRoute = location.pathname.startsWith(`/instructor/${idInstructor}/servicio/`);
  const isConfigService = location.pathname.startsWith(`/instructor/${idInstructor}/servicio/${idServicio}/info-servicio`);
  const isInstructorService = location.pathname === `/instructor/${idInstructor}/servicios`;
  const isLogin = location.pathname === `/login`;
  const isCreateServiceRoute = location.pathname === `/instructor/${idInstructor}/crear-servicio`;
  const isNavbarSimple = location.pathname === `/instructor/${idInstructor}/editar-usuario`;
  const isRegisterRoute = location.pathname.startsWith('/registro');
  const isAlumnoRoute = location.pathname === `/alumno/${idAlumno}/servicios`; // Nueva condición para alumnos
  const isAlumnosDashRoute = location.pathname === `/alumno/${idAlumno}/inscripciones/${idInscripcion}/mi-inscripcion`
  const isAlumnoAtrasRoute = location.pathname === `/alumno/${idAlumno}/inscripciones/${idInscripcion}/mi-inscripcion/asistencias`
  const isAlumnoCuotas = location.pathname === `/alumno/${idAlumno}/inscripciones/pagos`
  const isAlumnoRouteIns = location.pathname === `/alumno/${idAlumno}/inscripciones`;
  const isDescubrirRoute = location.pathname === `/alumno/${idAlumno}/descubrir-servicios`;
  const isInfoServicioAlumnoRoute = location.pathname === `/alumno/${idAlumno}/servicio/${idServicio}/info-servicio`;
  const isEditService = location.pathname.startsWith(`/instructor/${idInstructor}/servicio/${idServicio}/editar-servicio`);

  useEffect(() => {
    const fetchInscripciones = async () => {
      if (location.pathname.startsWith(`/alumno/${idAlumno}`) ) {
        try {
          const data = await getInscripcionesDeAlumno(idAlumno);
          setInscripciones(data);
          console.log("Inscripciones", inscripciones)
  
          tieneInscripcionesConCuotas(inscripciones);
  
        } catch (error) {
          console.error("Error al traer las inscripciones del alumno:", error);
        }
      }
      
    };
    fetchInscripciones();
  }, [idAlumno]);

  const tieneInscripcionesConCuotas = (inscripciones) => {
    console.log("Tiene inscripciones con cuotas", inscripciones.every(inscripciones => inscripciones.estado != "PendienteAceptacion" || inscripciones.estado == "Rechazada"));
    return inscripciones.every(inscripciones => inscripciones.estado != "PendienteAceptacion" || inscripciones.estado == "Rechazada");
  }

  return (
    <>
      {/* Muestra la Navbar de inicio en la ruta principal */}
      {isPrincipalRoute && <Navbar />}

      {/* Muestra NavbarInstructor en la ruta específica del servicio */}
      {isInstructorRoute && <NavbarInstructor />}

      {/* Muestra NavbarServicio en la ruta de creación de servicio */}
      {isCreateServiceRoute && <NavbarServicio />}
      {isEditService && <NavbarSimple />}
      {isNavbarSimple && <NavbarSimple />}
      {isConfigService && <NavbarMisServicios />}
      {/* Muestra NavbarRegisterChooser en rutas de registro */}
      {isRegisterRoute && <NavbarRegisterChooser />}
      {isInstructorService && <NavbarServicio />}
      {isLogin && <NavbarRegisterChooser />}

      {/* Navbar Placeholder de los Alumnos... */}
      {isAlumnoRoute && <NavbarAlumno />}

      {isAlumnosDashRoute && <NavbarAlumnoDash />}

      {isAlumnoAtrasRoute && <NavbarAlumnoAtras />}

      {isAlumnoRouteIns && <NavbarGeneralAlumno inscripcionesConCuotas={tieneInscripcionesConCuotas(inscripciones)} />}

      {isDescubrirRoute &&
        (inscripciones.length > 0 ? (
          <NavbarGeneralAlumno inscripcionesConCuotas={tieneInscripcionesConCuotas(inscripciones)} />
        ) : (
          <NavbarAlumno />
        ))}

      {isInfoServicioAlumnoRoute && <NavbarSimple />}
      {isAlumnoCuotas && <NavbarGeneralAlumno inscripcionesConCuotas={tieneInscripcionesConCuotas(inscripciones)} />}
    </>
  );
};

export default AppNavbar;
