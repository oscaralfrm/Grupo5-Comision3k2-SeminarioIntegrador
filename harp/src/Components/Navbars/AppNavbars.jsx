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
import { getAlumnoById, getInscripcionesDeAlumno } from '../../services/Alumno.js';
import { obtenerUltimasCuotasDeInscripcion } from '../../services/Cuota.js';
import { getInstructorById } from '../../services/Instructor.js';
import NavbarInstructorAtras from '../Instructor/MiServicio/NavbarInstructor/NavbarAtrasInstructor.jsx';


const AppNavbar = () => {
  const location = useLocation();
  const { idInstructor, idServicio, idAlumno, idInscripcion, nombreAlumno, nombreInstructor } = useParams();
  const [inscripciones, setInscripciones] = useState([]);
  const [usuario, setUsuario] = useState(null);



  // Define condiciones para mostrar las Navbars
  const isPrincipalRoute = location.pathname === '/';
  //const isInstructorRoute = location.pathname.startsWith(`/instructor/${idInstructor}/servicio/`);
  const isInstructorRoute = location.pathname.startsWith(`/instructor/${idInstructor}/servicio/${idServicio}/cobros`) 
                            ||  location.pathname.startsWith(`/instructor/${idInstructor}/servicio/${idServicio}/alumnos`) 
                            ||  location.pathname.startsWith(`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`) ;
  const isConfigService = location.pathname.startsWith(`/instructor/${idInstructor}/servicio/${idServicio}/configurar`);
  const isInstructorService = location.pathname === `/instructor/${idInstructor}/servicios`;
  const isInstructorEstadisticas = location.pathname === `/instructor/${idInstructor}/estadisticas`;
  const isInstructorHorarios = location.pathname === `/instructor/${idInstructor}/horarios`;
  const isInstructorResumenAlumnos = location.pathname === `/instructor/${idInstructor}/alumnos/${nombreAlumno}`;
  const isResumenInstructor = location.pathname === `/alumno/${idAlumno}/instructores/${nombreInstructor}` || location.pathname === `/instructor/${idInstructor}/instructores/${nombreInstructor}`;
  const isResumenInscripcion = location.pathname === `/instructor/${idInstructor}/servicio/${idServicio}/inscripciones/${idInscripcion}`;
  const isLogin = location.pathname === `/login`;
  const isCreateServiceRoute = location.pathname === `/instructor/${idInstructor}/crear-servicio`;
  const isProfile = location.pathname.includes("perfil");
  const isRegisterRoute = location.pathname.startsWith('/registro');
  const isAlumnoRoute = location.pathname === `/alumno/${idAlumno}/servicios`; // Nueva condición para alumnos
  const isAlumnosDashRoute = location.pathname === `/alumno/${idAlumno}/inscripciones/${idInscripcion}/mi-inscripcion`
  const isAlumnoAtrasRoute = location.pathname === `/alumno/${idAlumno}/inscripciones/${idInscripcion}/mi-inscripcion/asistencias`
  const isAlumnoCuotas = location.pathname === `/alumno/${idAlumno}/inscripciones/pagos`
  const isAlumnoRouteIns = location.pathname === `/alumno/${idAlumno}/inscripciones`;
  const isDescubrirRoute = location.pathname === `/alumno/${idAlumno}/descubrir-servicios`;
  const isDescubirInstructorRoute = location.pathname === `/instructor/${idInstructor}/descubrir-servicios`;
  const isSolicitudesInscripcion = location.pathname === `/instructor/${idInstructor}/servicios/inscripciones`;
  const isInfoServicioAlumnoRoute = location.pathname === `/alumno/${idAlumno}/servicio/${idServicio}/info-servicio`;
  const isInfoServicioInstructorRoute = location.pathname === `/instructor/${idInstructor}/servicio/${idServicio}/info-servicio`;
  const isEditService = location.pathname.startsWith(`/instructor/${idInstructor}/servicio/${idServicio}/editar-servicio`);
  const isAlumnoResenia = location.pathname === `/alumno/${idAlumno}/inscripciones/${idInscripcion}/resenias` ;
  const isServiciosFavoritos = location.pathname === `/alumno/${idAlumno}/servicios-favoritos` 
  const isHistorialClases = location.pathname == `/instructor/${idInstructor}/servicio/${idServicio}/historial-clases`;
  const isEstadisticasAsistencias = location.pathname == `/instructor/${idInstructor}/servicio/${idServicio}/historial-clases/estadisticas`


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

    useEffect(() => {
      const fetchUsuario = async () => {
        try {
          if (idInstructor) {
            const data = await getInstructorById(idInstructor);
            setUsuario(data);
          }
          if (idAlumno) {
            const data = await getAlumnoById(idAlumno);
            setUsuario(data);
          }
        } catch (error) {
          console.error("Error al traer el usuario:", error);
        }
      };
  
      fetchUsuario();
    }, [idInstructor, idAlumno]);
  


  const tieneInscripcionesConCuotas = (inscripciones) => {
    return ! inscripciones.every(inscripciones => inscripciones.estado == "PendienteAceptacion" || inscripciones.estado == "Rechazada");
  }


  return (
    <>
      {/* Muestra la Navbar de inicio en la ruta principal */}
      {isPrincipalRoute && <Navbar />}


      {/* Muestra NavbarInstructor en la ruta específica del servicio */}
      {isInstructorRoute && <NavbarInstructor />}
      {isDescubirInstructorRoute && <NavbarServicio usuario={usuario} />}
      {isSolicitudesInscripcion && <NavbarServicio usuario={usuario} /> }


      {/* Muestra NavbarServicio en la ruta de creación de servicio */}
      {isCreateServiceRoute && <NavbarServicio usuario={usuario} />}
      {isEditService && <NavbarSimple usuario={usuario} />}


       {/* Para ver perfil y editar perfil de usuario */}
      {isProfile && <NavbarSimple usuario={usuario} />}


       {/* Para ver resumen de alumno por el instructor */}
      {(isInstructorResumenAlumnos || isResumenInstructor || isResumenInscripcion) && <NavbarSimple usuario={usuario}/>}

      {isAlumnoResenia && <NavbarAlumnoDash usuario={usuario} />}

      {isConfigService && <NavbarMisServicios usuario={usuario} />}
      {/* Muestra NavbarRegisterChooser en rutas de registro */}
      {isRegisterRoute && <NavbarRegisterChooser />}
      {isInstructorService && <NavbarServicio usuario={usuario} />}
      {isInstructorEstadisticas && <NavbarServicio usuario={usuario} />}
      {isInstructorHorarios && <NavbarServicio usuario={usuario} />}
      {isLogin && <NavbarRegisterChooser />}

      {isHistorialClases && <NavbarInstructorAtras usuario={usuario}/>}

      {isEstadisticasAsistencias && <NavbarInstructorAtras usuario={usuario}/>}

       {/* Para ver servicios favoritos por el alumno*/}
       {isServiciosFavoritos && <NavbarGeneralAlumno  usuario={usuario} />}


      {/* Navbar Placeholder de los Alumnos... */}
      {isAlumnoRoute && <NavbarAlumno usuario={usuario} />}


      {isAlumnosDashRoute && <NavbarAlumnoDash usuario={usuario} />}


      {isAlumnoAtrasRoute && <NavbarAlumnoAtras usuario={usuario} />}


      {isAlumnoRouteIns && <NavbarGeneralAlumno inscripcionesConCuotas={tieneInscripcionesConCuotas(inscripciones)} usuario={usuario} />}


      {isDescubrirRoute &&
        (inscripciones.length > 0 ? (
          <NavbarGeneralAlumno inscripcionesConCuotas={tieneInscripcionesConCuotas(inscripciones)} usuario={usuario} />
        ) : (
          <NavbarAlumno usuario={usuario}/>
        ))}

      { isInfoServicioAlumnoRoute  && <NavbarGeneralAlumno usuario={usuario}  />}
      {isInfoServicioInstructorRoute && <NavbarMisServicios usuario={usuario}  />}
      {isAlumnoCuotas && <NavbarGeneralAlumno inscripcionesConCuotas={tieneInscripcionesConCuotas(inscripciones)} usuario={usuario} />}
    </>
  );
};


export default AppNavbar;