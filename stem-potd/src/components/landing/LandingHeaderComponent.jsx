import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../../assets/css/templatemo-lava.css'

const LandingHeaderComponent = () => {
    
    return (
        <header className = "header-area header-sticky">
            <Container>
                <Row>
                    <Col xs={12}>
                        <nav className ="main-nav">
                            <a href="/LandingPage" className="logo">STEM POTD</a>
                            <ul className="nav">
                                <li className="scroll-to-section"><a href="#welcome" className="menu-item">Home</a></li>
                                <li className="scroll-to-section"><a href="#about" className="menu-item">News</a></li>
                                <li className="scroll-to-section"><a href="#testimonials" className="menu-item">Team</a></li>
                                <li className="scroll-to-section"><a href="signin" className="menu-item">Sign In</a></li>
                            </ul>
                            <a className='menu-trigger'>
                                <span>Menu</span>
                            </a>
                        </nav>
                    </Col>
                </Row>
            </Container>
        </header>
    );
};

export default LandingHeaderComponent;