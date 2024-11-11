import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Imports de los componentes
import { LoginForm } from "./Components/InicioSesion/InicioSesion";
import { RegisterFormChooser } from "./Components/RegistroSesion/RegisterChooser";
import { RegisterFormInstructor } from "./Components/RegistroSesion/RegisterInstructor/RegisterFormInstructor";
import { RegisterFormStudent } from "./Components/RegistroSesion/RegisterStudent/RegisterFormStudent";
import ServiceCreationStep1 from "./Components/Instructor/Servicio/ServicioPaso1";
import ServiceCreationStep2 from "./Components/Instructor/Servicio/ServicioPaso2";
import ServiceCreationStep3 from "./Components/Instructor/Servicio/ServicioPaso3";
import ServiceCreationStep4 from "./Components/Instructor/Servicio/ServicioPaso4";
import CreateGroups from "./Components/Instructor/Grupo/CrearGrupo";
import MiServicio from "./Components/Instructor/MiServicio/MiServicio";
import PaginaDeInicio from "./Components/PaginaDeInicio/PaginaDeInicio";
import General from "./Components/Instructor/MiServicio/MenuOpciones/General";
import Cobros from "./Components/Instructor/MiServicio/MenuOpciones/Cobros";
import Alumnos from "./Components/Instructor/MiServicio/MenuOpciones/Alumnos";
import Servicio from "./Components/Instructor/MiServicio/MenuOpciones/Servicio";
import ServicioForm from "./Components/Instructor/Servicio/RegistrarServicio.jsx";
import AppNavbar from "./Components/Navbars/AppNavbars.jsx";
import Asistencias from "./Components/Instructor/MiServicio/MenuOpciones/Asistencias.jsx";

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
          <Route
            path="instructor/:idInstructor/crear-servicio"
            element={<><AppNavbar /><ServicioForm /></>}
          />
          <Route
            path="instructor/:idInstructor/crear-servicio/paso2"
            element={<><AppNavbar /><ServiceCreationStep2 /></>}
          />
          <Route
            path="instructor/:idInstructor/crear-servicio/paso2/paso3"
            element={<><AppNavbar /><ServiceCreationStep3 /></>}
          />
          <Route
            path="instructor/:idInstructor/crear-servicio/paso2/paso3/paso4"
            element={<><AppNavbar /><ServiceCreationStep4 /></>}
          />
          <Route
            path="instructor/:idInstructor/servicio/:idServicio/crear-grupo"
            element={<><AppNavbar /><CreateGroups /></>}
          />
          <Route
            path="instructor/:idInstructor/servicio/:idServicio"
            element={<><AppNavbar /><MiServicio /></>}
          />
          <Route
            path="instructor/:idInstructor/servicio/:idServicio/general"
            element={<><AppNavbar /><General /></>}
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
            path="instructor/:idInstructor/servicio/:idServicio/mi-servicio"
            element={<><AppNavbar /><Servicio /></>}
          />
          <Route
            path="instructor/:idInstructor/servicio/:idServicio/mi-servicio/clase/:idClase/asistencias"
            element={<><AppNavbar /><Asistencias /></>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
