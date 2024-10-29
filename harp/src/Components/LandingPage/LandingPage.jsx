import React from "react";
import Navbar from "./NavbarLandingPage/NavbarLandingPage";
import "./LandingPage.css";
import CardInfo from "./CardInfo";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <div className="welcome-sticker">
        <img src="ruta-del-robot.png" alt="Bienvenido a Harp" />
      </div>
      <div><CardInfo /></div>
    </div> 
  );
};

export default LandingPage;

