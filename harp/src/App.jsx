// import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Imports...
import Navbar from "./Components/Navbar/Navbar";
import LandingPage from "./Components/LandingPage/LandingPage";
import SeleccionarDeCategorias from "./Components/Servicios/SeleccionDeCategorias";
import { RegisterFormChooser } from "./Components/RegisterChooser/RegisterChooser";
import { Footer } from "./Components/Footer/Footer";
import { RegisterFormStudent } from "./Components/RegisterChooser/RegisterFormStudent/RegisterFormStudent";
import { LoginForm } from "./Components/LoginForm/LoginForm";
import { RegisterFormInstructor } from "./Components/RegisterChooser/RegisterFormInstructor/RegisterFormInstructor";
import InstructorPrincipal from "./Components/InstructorPrincipal/InstructorPrincipal";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div> {/* Ajusta este valor según la altura de tu navbar */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/registrarse" element={<RegisterFormChooser />} />
            <Route path="/servicios" element={<SeleccionarDeCategorias />} />
            <Route path="/registrarse/alumno" element={<RegisterFormStudent />} />
            <Route path="/registrarse/instructor" element={<RegisterFormInstructor />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/instructor/:idInstructor/*" element={<InstructorPrincipal />} /> 
          </Routes>
        </div>
      </BrowserRouter>
      <Footer/>
    </>
  );
}

export default App;
