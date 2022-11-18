import React from 'react'
import LandingMainComponent from './components/landing/LandingMainComponent'
import HeaderComponent from './components/landing/HeaderComponent'
// import '@assets/css/owl-carousel.css'
// import '@assets/css/flex-slider.css'
import '@assets/css/font-awesome.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/templatemo-lava.css'
import FooterComponent from 'components/landing/FooterComponent'

function App() {
    return (
        <>
            <HeaderComponent />
            <LandingMainComponent />
            <FooterComponent />
        </>
    )
}

export default App
