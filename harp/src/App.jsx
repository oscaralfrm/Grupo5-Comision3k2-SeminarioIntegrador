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
import DescubrirServicios from "./Components/Alumno/DescubrirServicios.jsx";
import { EditUsuario } from "./Components/EditUsuarios/EditUsuario.jsx";
import EditServicioForm from "./Components/Instructor/EditServicio/EditServicio.jsx";

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

          // Para instructor...

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
            path="instructor/:idInstructor/servicio/:idServicio/info-servicio"
            element={<><AppNavbar /><InfoServicioPage /></>}
          />
          <Route
            path="instructor/:idInstructor/editar-usuario"
            element={<><AppNavbar /><EditUsuario /></>}
          />


          // Para alumnos...


          <Route
            path="alumno/:idAlumno/servicios"
            element={<><AppNavbar /><DescubrirServicios /></>}
          />

          <Route path="instructor/:idInstructor/servicio/:idServicio/crear-grupo" element={<><AppNavbar />< CrearGrupo /></>} />
          {/* <Route path="instructor/:idInstructor/servicio/:idServicio/configuracion/crear-grupo" element={<><AppNavbar /><CrearGrupo /></>} /> */}

        </Routes>
      </BrowserRouter>
    </div>
  );
}

// <Route path= "alumno/:idAlumno/cursos" element={<><AppNavbar /><MisCursos /></>}/>

export default App;
