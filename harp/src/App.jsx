import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Imports de los componente
import { LoginForm } from "./Components/InicioSesion/InicioSesion";
import { RegisterFormChooser } from "./Components/RegistroSesion/RegisterChooser";
import {RegisterFormInstructor} from "./Components/RegistroSesion/RegisterInstructor/RegisterFormInstructor";
import {RegisterFormStudent} from "./Components/RegistroSesion/RegisterStudent/RegisterFormStudent";
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

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter>
                <div className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<PaginaDeInicio />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/registro" element={<RegisterFormChooser />} />
                        <Route path="/registro/instructor" element={<RegisterFormInstructor />} />
                        <Route path="/registro/alumno" element={<RegisterFormStudent />} />
                        <Route path="/registro" element={<RegisterFormChooser/>}/>
                        <Route path="/instructor/:idInstructor/crear-servicio" element={<ServiceCreationStep1/>}/>
                        <Route path="/instructor/:idInstructor/crear-servicio/paso2" element={<ServiceCreationStep2/>}/>
                        <Route path="/instructor/:idInstructor/crear-servicio/paso2/paso3" element={<ServiceCreationStep3/>}/>
                        <Route path="/instructor/:idInstructor/crear-servicio/paso2/paso3/paso4" element={<ServiceCreationStep4/>}/>
                        <Route path="/instructor/:idInstructor/servicio/:idServicio/crear-grupo" element={<CreateGroups/>}/>
                        <Route path="/instructor/:idInstructor/servicio/:idServicio" element={<MiServicio/>}/>
                        <Route path="/instructor/:idInstructor/servicio/:idServicio/general" element={<General/>}/>
                        <Route path="/instructor/:idInstructor/servicio/:idServicio/cobro" element={<Cobros/>}/>
                        <Route path="/instructor/:idInstructor/servicio/:idServicio/alumnos" element={<Alumnos/>}/>
                        <Route path="/instructor/:idInstructor/servicio/:idServicio/mi-Servicio" element={<Servicio/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
