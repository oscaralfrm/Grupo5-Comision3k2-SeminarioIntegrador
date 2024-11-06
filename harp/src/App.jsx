import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Imports de los componentes
import LandingPage from "./Components/PaginaDeInicio/PaginaDeInicio";
import { LoginForm } from "./Components/InicioSesion/InicioSesion";
import { RegisterFormChooser } from "./Components/RegistroSesion/RegisterChooser";
import ServiceCreationStep1 from "./Components/Instructor/Servicio/ServicioPaso1";
import ServiceCreationStep2 from "./Components/Instructor/Servicio/ServicioPaso2";
import ServiceCreationStep3 from "./Components/Instructor/Servicio/ServicioPaso3";
import ServiceCreationStep4 from "./Components/Instructor/Servicio/ServicioPaso4";

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter>
                <div className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/registro" element={<RegisterFormChooser/>}/>
                        <Route path="/instructor/:idInstructor/crear-servicio" element={<ServiceCreationStep1/>}/>
                        <Route path="/instructor/:idInstructor/crear-servicio/paso2" element={<ServiceCreationStep2/>}/>
                        <Route path="/instructor/:idInstructor/crear-servicio/paso2/paso3" element={<ServiceCreationStep3/>}/>
                        <Route path="/instructor/:idInstructor/crear-servicio/paso2/paso3/paso4" element={<ServiceCreationStep4/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
