import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

// Imports...

import LandingPage from "./Components/LandingPage/LandingPage";

function App() {

  return (
    <>

      <Router>
        <LandingPage/>

      </Router>

    </>
  )
}

export default App;
