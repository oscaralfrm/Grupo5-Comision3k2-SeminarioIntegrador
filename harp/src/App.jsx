import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Imports...
import Navbar from "./Components/Navbar/Navbar";
import LandingPage from "./Components/LandingPage/LandingPage";

function App() {

  return (
    <>

      <Router>
        <div className="container">
          <Navbar/>
        </div>
       <div className="containter">
       <LandingPage/>
       </div> 
        

      </Router>

    </>
  )
}

export default App;
