import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Imports de los componentes
import LandingPage from "./Components/PaginaDeInicio/PaginaDeInicio";
import { LoginForm } from "./Components/InicioSesion/InicioSesion";
import { RegisterFormChooser } from "./Components/RegistroSesion/RegisterChooser";

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter>
                <div className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/registro" element={<RegisterFormChooser/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
