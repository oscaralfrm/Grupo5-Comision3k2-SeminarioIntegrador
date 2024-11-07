import React from 'react';
import Navbar from './NavbarLandingPage/NavbarLandingPage';
import CardInfo from './CardInfo';
import WelcomeSticker from './WelcomeSticker';
import Footer from './FooterLandingPage/Footer';

export default function PaginaDeInicio() {
    return (
        <div>

            <WelcomeSticker />
            <CardInfo />
            <Footer/>
        </div>
    );
}
