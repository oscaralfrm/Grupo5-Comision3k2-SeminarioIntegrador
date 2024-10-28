import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Imports...
import LandingPage from "./Components/LandingPage/LandingPage";
import SeleccionarDeCategorias from "./Components/Servicios/SeleccionDeCategorias";
import { RegisterFormChooser } from "./Components/RegisterChooser/RegisterChooser";
import { Footer } from "./Components/Footer/Footer";
import { RegisterFormStudent } from "./Components/RegisterChooser/RegisterFormStudent/RegisterFormStudent";
import { LoginForm } from "./Components/LoginForm/LoginForm";
import { RegisterFormInstructor } from "./Components/RegisterChooser/RegisterFormInstructor/RegisterFormInstructor";
import InstructorPrincipal from "./Components/InstructorPrincipal/InstructorPrincipal";
import AlumnoPrincipal from "./Components/AlumnoPrincipal/AlumnoPrincipal";
import CursosDisponibles from "./Components/AlumnoPrincipal/Cursos/Cursos";
import DetalleCurso from "./Components/AlumnoPrincipal/Cursos/DetalleCurso";
import CursoEspecifico from "./Components/AlumnoPrincipal/Cursos/CursoEspecifico";


function App() {

    return (
        <div style={{ display: 's-flex', flexDirection: 'column', minHeight: '100vh' }}>
            <BrowserRouter>
                <div style={{ flex: 1}}> {/* Ajusta este padding según sea necesario */}
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/registrarse" element={<RegisterFormChooser />} />
                        <Route path="/servicios" element={<SeleccionarDeCategorias />} />
                        <Route path="/registrarse/alumno" element={<RegisterFormStudent />} />
                        <Route path="/registrarse/instructor" element={<RegisterFormInstructor />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/instructor/:idInstructor/*" element={<InstructorPrincipal />} />
                        <Route path="/alumno/:idAlumno/*" element={<AlumnoPrincipal />} />
                        <Route path="/alumno/:idAlumno/cursos" element={<CursosDisponibles />} />
                        <Route path="/alumno/:idAlumno/mis-cursos/:IdCurso" element={<CursoEspecifico />} />
                        <Route path="/alumno/:idAlumno/cursos/:IdCurso" element={<DetalleCurso />} />
                    </Routes>
                </div>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
