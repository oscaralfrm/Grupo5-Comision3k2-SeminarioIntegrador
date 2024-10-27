import React from "react";
import Navbar from "./NavbarLandingPage/NavbarLandingPage";
import "./LandingPage.css";
import CardInfo from "./CardInfo";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <div><CardInfo /></div>
    </div> 
  );
};

export default LandingPage;
