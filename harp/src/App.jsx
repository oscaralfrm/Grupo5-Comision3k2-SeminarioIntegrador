import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Imports de los componentes
import { LoginForm } from "./Components/InicioSesion/InicioSesion";
import { RegisterFormChooser } from "./Components/RegistroSesion/RegisterChooser";
import { RegisterFormInstructor } from "./Components/RegistroSesion/RegisterInstructor/RegisterFormInstructor";
import { RegisterFormStudent } from "./Components/RegistroSesion/RegisterStudent/RegisterFormStudent";

import PaginaDeInicio from "./Components/PaginaDeInicio/PaginaDeInicio";
import Cobros from "./Components/Instructor/MiServicio/MenuOpciones/Cobros";
import Alumnos from "./Components/Instructor/MiServicio/MenuOpciones/Alumnos";
import Servicio from "./Components/Instructor/MiServicio/MenuOpciones/Servicio";
import ServicioForm from "./Components/Instructor/Servicio/RegistrarServicio.jsx";
import AppNavbar from "./Components/Navbars/AppNavbars.jsx";
import Asistencias from "./Components/Instructor/MiServicio/MenuOpciones/Asistencias.jsx";
import Dashboard from "./Components/Instructor/MisServicios/MisServicios.jsx";
import CrearGrupo from "./Components/Instructor/MiServicio/MenuOpciones/Dashboard/Grupos.jsx";
import Configuracion from "./Components/Instructor/MiServicio/MenuOpciones/Configuracion.jsx";
import InfoServicioPage from "./Components/Instructor/InfoServicioPage/InfoServicioPage.jsx";

import InformacionDelServicio from "./Components/Alumno/InformacionDelServicio.jsx"; // <-- Importación corregida

import { EditUsuario } from "./Components/EditUsuarios/EditUsuario.jsx";
import ServicioAlumno from "./Components/Alumno/MenuOpciones/ServicioAlumno.jsx";
//import Servicio0 from "./Components/Alumno/MenuOpciones/Servicio.jsx";
import EditServicioForm from "./Components/Instructor/EditServicio/EditServicio.jsx";
import AsistenciasAlumno from "./Components/Alumno/MenuOpciones/AsistenciasAlumno.jsx";
import MisInscripciones from "./Components/Alumno/Cursos/MisInscripciones.jsx";
import InfoServicioAlumno from "./Components/Alumno/InfoServicioAlumno.jsx";
import MisCuotas from "./Components/Alumno/Pagos/PagosPage.jsx";
import ProfileInfo from "./Components/VerPerfil/Perfil.jsx";
import ReseniasAlumno from "./Components/Alumno/MenuOpciones/ReseniasAlumno.jsx";
import DescubrirServicios from "./Components/Alumno/DescubrirServicios/DescubrirServicios.jsx";
import ResumenUsuario from "./Components/VerPerfil/ResumenUsuario/ResumenUsuario.jsx";
import ResumenInscripcion from "./Components/Instructor/ResumenInscripcion/ResumenInscripcion.jsx";
import ServiciosFavoritos from "./Components/Alumno/ServiciosFavoritos/ServiciosFavoritos.jsx";
import HistorialClasesInstructor from "./Components/Instructor/MiServicio/MenuOpciones/Dashboard/HistorialClases.jsx";
import EstadisticasAsistencia from "./Components/Instructor/MiServicio/MenuOpciones/Dashboard/EstadisticasAsistencias.jsx";
import PantallaSolicitudesInscripcion from "./Components/Instructor/Inscripciones/SolicitudesInscripcion.jsx";
import Estadisticas from "./Components/Instructor/Estadisticas/Estadisticas.jsx";
import SolicitudInscripcionData from "./Components/Instructor/Inscripciones/DatosSolicitudInscripcion.jsx";
import Horario from "./Components/Instructor/HorarioSemanal/Horario.jsx";

//import MisCursos from "./Components/Alumno/Cursos/MisCursos.jsx";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<><AppNavbar /><PaginaDeInicio /></>} />
          <Route path="login" element={<><AppNavbar /><LoginForm /></>} />
          <Route path="registro" element={<><AppNavbar /><RegisterFormChooser /></>} />
          <Route
            path="registro/instructor"
            element={<><AppNavbar /><RegisterFormInstructor /></>}
          />
          <Route path="registro/alumno" element={<><AppNavbar /><RegisterFormStudent /></>} />

          {/* Para Cualquier Usuario */}
          <Route
            path="instructor/:idInstructor/alumnos/:nombreAlumno"
            element={<><AppNavbar /><ResumenUsuario /></>}
          />
          <Route
            path="alumno/:idAlumno/instructores/:nombreInstructor"
            element={<><AppNavbar /><ResumenUsuario /></>}
          />
          <Route
            path="instructor/:idInstructor/instructores/:nombreInstructor"
            element={<><AppNavbar /><ResumenUsuario /></>}
          />

          {/* Para Instructor */}

          <Route
            path="instructor/:idInstructor/crear-servicio"
            element={<><AppNavbar /><ServicioForm /></>}
          />

          <Route
            path="instructor/:idInstructor/servicio/:idServicio/editar-servicio"
            element={<><AppNavbar /><EditServicioForm /></>}
          />

          <Route
            path="instructor/:idInstructor/servicio/:idServicio/cobros"
            element={<><AppNavbar /><Cobros /></>}
          />
          <Route
            path="instructor/:idInstructor/estadisticas"
            element={<><AppNavbar /><Estadisticas /></>}
          />
          <Route
            path="instructor/:idInstructor/horarios"
            element={<><AppNavbar /><Horario /></>}
          />
                    
          <Route
            path="instructor/:idInstructor/servicios/inscripciones"
            element={<><AppNavbar /><PantallaSolicitudesInscripcion /></>}
          />

          <Route
            path="instructor/:idInstructor/servicio/:idServicio/alumnos"
            element={<><AppNavbar /><Alumnos /></>}
          />
          <Route
            path="instructor/:idInstructor/servicio/:idServicio/configuracion"
            element={<><AppNavbar /><Configuracion /></>}
          />
          <Route
            path="instructor/:idInstructor/servicio/:idServicio/mi-servicio"
            element={<><AppNavbar /><Servicio /></>}
          />
          <Route
            path="instructor/:idInstructor/servicio/:idServicio/mi-servicio/clase/:idClase/asistencias"
            element={<><AppNavbar /><Asistencias /></>}
          />
          <Route
            path="instructor/:idInstructor/servicios"
            element={<><AppNavbar /><Dashboard /></>}
          />
          <Route
            path="instructor/:idInstructor/servicio/:idServicio/configurar"
            element={<><AppNavbar /><InfoServicioPage /></>}
          />
          <Route
            path="instructor/:idInstructor/editar-usuario"
            element={<><AppNavbar /><EditUsuario /></>}
          />

          <Route
            path="instructor/:idInstructor/perfil/ver-perfil"
            element={<><AppNavbar /><ProfileInfo /></>}
          />

          <Route
            path="instructor/:idInstructor/servicio/:idServicio/inscripciones/:idInscripcion"
            element={<><AppNavbar /><ResumenInscripcion /></>}
          />

          <Route
            path="instructor/:idInstructor/descubrir-servicios"
            element={<><AppNavbar /><DescubrirServicios /></>}
          />
          <Route
            path="instructor/:idInstructor/servicio/:idServicio/info-servicio"
            element={<><AppNavbar /><InfoServicioAlumno /></>}
          />

          <Route 
          path = "instructor/:idInstructor/servicio/:idServicio/historial-clases"
          element={<><AppNavbar/><HistorialClasesInstructor/></>}
          />

<Route 
          path = "instructor/:idInstructor/servicio/:idServicio/historial-clases/estadisticas"
          element={<><AppNavbar/><EstadisticasAsistencia/></>}
          />

          {/* Para alumnos... */}


          <Route
            path="alumno/:idAlumno/descubrir-servicios"
            element={<><AppNavbar /><DescubrirServicios /></>}
          />

          <Route
            path="alumno/:idAlumno/inscripciones/:idInscripcion/mi-inscripcion"
            element={<><AppNavbar /><ServicioAlumno /></>}
          />

          <Route path="instructor/:idInstructor/servicio/:idServicio/crear-grupo" element={<><AppNavbar />< CrearGrupo /></>} />
          <Route
            path="alumno/:idAlumno/inscripciones/:idInscripcion/detalles"
            element={<><AppNavbar /><InformacionDelServicio /></>}
          />
          <Route
            path="alumno/:idAlumno/inscripciones"
            element={<><AppNavbar /><MisInscripciones /></>}
          />

          <Route
            path="alumno/:idAlumno/servicio/:idServicio/info-servicio"
            element={<><AppNavbar /><InfoServicioAlumno /></>}
          />

          <Route
            path="alumno/:idAlumno/editar-usuario"
            element={<><AppNavbar /><EditUsuario /></>}
          />
          <Route
            path="alumno/:idAlumno/perfil/ver-perfil"
            element={<><AppNavbar /><ProfileInfo /></>}
          />

          <Route
            path="alumno/:idAlumno/servicios-favoritos"
            element={<><AppNavbar /><ServiciosFavoritos /></>}
          />


          <Route path="instructor/:idInstructor/servicio/:idServicio/crear-grupo" element={<><AppNavbar />< CrearGrupo /></>} />
          {/* <Route path="instructor/:idInstructor/servicio/:idServicio/configuracion/crear-grupo" element={<><AppNavbar /><CrearGrupo /></>} /> */}


          <Route path="alumno/:idAlumno/inscripciones/:idInscripcion/mi-inscripcion/asistencias" element={<><AppNavbar />< AsistenciasAlumno /></>}></Route>

          <Route path="alumno/:idAlumno/inscripciones/pagos" element={<><AppNavbar />< MisCuotas /></>}></Route>

          <Route path="alumno/:idAlumno/inscripciones/:idInscripcion/resenias" element={<><AppNavbar />< ReseniasAlumno /></>}></Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

// <Route path= "alumno/:idAlumno/cursos" element={<><AppNavbar /><MisCursos /></>}/>

export default App;
