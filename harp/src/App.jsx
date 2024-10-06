import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  // <--- Agrega Route aquí
import 'bootstrap/dist/css/bootstrap.min.css';

// Imports...
import Navbar from "./Components/Navbar/Navbar";
import LandingPage from "./Components/LandingPage/LandingPage";
import SeleccionarDeCategorias from "./Components/Servicios/SeleccionDeCategorias";
import {Inicio} from "./Components/LoginForm/LoginForm";  // Asegúrate de que estos componentes estén importados correctamente
import {RegistroUsuario} from "./Components/RegistrationForm/Registration";  // Asegúrate de que estos componentes estén importados correctamente

function App() {

  return (
    <>
      <Router>
        <div className="container">
          <Navbar />
          
          {/* Aquí es donde defines las rutas */}
          <Routes>
            <Route path="/login" element={<Inicio />} />  {/* Rutas colocadas dentro de <Routes> */}
            <Route path='/registro' element={<RegistroUsuario />} />
            <Route path="/" element={<LandingPage />} />  {/* Ruta para la landing page */}
            <Route path="/servicios" element={<SeleccionarDeCategorias />} /> 
          </Routes>

        </div>

        {/* <div className="container">
          <SeleccionarDeCategorias />
        </div>    */}     

      </Router>
    </>
  );
}

export default App;

