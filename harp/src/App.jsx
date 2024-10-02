import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Imports...
import Navbar from "./Components/Navbar/Navbar";
import LandingPage from "./Components/LandingPage/LandingPage";
import SeleccionarDeCategorias from "./Components/Servicios/SeleccionDeCategorias";

function App() {

  return (
    <>
      <Router>
        <div className="container">
          <Navbar/>
        </div>
        <div className="container">
          <SeleccionarDeCategorias/>
          </div>        

      </Router>

    </>
  )
}

export default App;
