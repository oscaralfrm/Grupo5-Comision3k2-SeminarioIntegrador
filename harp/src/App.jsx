
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Imports...
import LandingPage from "./Components/LandingPage/LandingPage";
import { RegisterFormChooser } from "./Components/RegisterChooser/RegisterChooser";
import {Footer}  from "./Components/Footer/Footer";
import { RegisterFormStudent } from "./Components/RegisterChooser/RegisterFormStudent/RegisterFormStudent";
import { LoginForm } from "./Components/LoginForm/LoginForm";
import { RegisterFormInstructor } from "./Components/RegisterChooser/RegisterFormInstructor/RegisterFormInstructor";
import InstructorPrincipal from "./Components/InstructorPrincipal/InstructorPrincipal";
import AlumnoPrincipal from "./Components/AlumnoPrincipal/AlumnoPrincipal";
import CursosDisponibles from "./Components/AlumnoPrincipal/Cursos/Cursos";
import DetalleCurso from "./Components/AlumnoPrincipal/Cursos/DetalleCurso";
import CursoEspecifico from "./Components/AlumnoPrincipal/Cursos/CursoEspecifico";
import ServiceCreationStep1 from "./Components/InstructorPrincipal/CrearServicio/Servicio/ServicioPaso1";
import ServiceCreationStep2 from "./Components/InstructorPrincipal/CrearServicio/Servicio/ServicioPaso2";
import ServiceCreationStep3 from "./Components/InstructorPrincipal/CrearServicio/Servicio/ServicioPaso3";
import ServiceCreationStep4 from "./Components/InstructorPrincipal/CrearServicio/Servicio/ServicioPaso4";
import CreateGroups from "./Components/InstructorPrincipal/CrearGrupo/CrearGrupo";


function App() {

    return (
        <div style={{ display: 's-flex', flexDirection: 'column', minHeight: '100vh' }}>
            <BrowserRouter>
                <div style={{ flex: 1}}> {/* Ajusta este padding según sea necesario */}
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/registrarse" element={<RegisterFormChooser />} />
                        <Route path="/registrarse/alumno" element={<RegisterFormStudent />} />
                        <Route path="/registrarse/instructor" element={<RegisterFormInstructor />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/instructor/:idInstructor/*" element={<InstructorPrincipal />} />
                        <Route path="/alumno/:idAlumno/*" element={<AlumnoPrincipal />} />
                        <Route path="/alumno/:idAlumno/cursos" element={<CursosDisponibles />} />
                        <Route path="/alumno/:idAlumno/mis-cursos/:IdCurso" element={<CursoEspecifico />} />
                        <Route path="/alumno/:idAlumno/cursos/:IdCurso" element={<DetalleCurso />} />
                        <Route path="/instructor/:idInstructor/crear-servicio" element={<ServiceCreationStep1/>}/>
                        <Route path="/instructor/:idInstructor/crear-servicio/paso2" element={<ServiceCreationStep2/>}/>
                        <Route path="/instructor/:idInstructor/crear-servicio/paso2/paso3" element={<ServiceCreationStep3/>}/>
                        <Route path="/instructor/:idInstructor/crear-servicio/paso2/paso3/paso4" element={<ServiceCreationStep4/>}/>
                        <Route path="/instructor/:idInstructor/crear-grupo" element={<CreateGroups/>}/>

                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
