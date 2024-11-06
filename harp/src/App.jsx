import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Imports de los componentes
import LandingPage from "./Components/PaginaDeInicio/PaginaDeInicio";
import { LoginForm } from "./Components/InicioSesion/InicioSesion";
import { RegisterFormChooser } from "./Components/RegistroSesion/RegisterChooser";
import {RegisterFormInstructor} from "./Components/RegistroSesion/RegisterInstructor/RegisterFormInstructor";
import {RegisterFormStudent} from "./Components/RegistroSesion/RegisterStudent/RegisterFormStudent";

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter>
                <div className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/registro" element={<RegisterFormChooser />} />
                        <Route path="/registro/instructor" element={<RegisterFormInstructor />} />
                        <Route path="/registro/alumno" element={<RegisterFormStudent />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
