import React from 'react';
import Container from "react-bootstrap/Container"
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import '../../assets/css/templatemo-lava.css'


const LandingWelcomeComponent = () => {
    return (
        <div class="welcome-area" id="welcome">
            <div class="header-text">
                <Container>
                    <Row>
                        <Col className='left-text' lg={6} md={12} sm={12} xs={12}>
                            <h1>STEM <em>POTD</em></h1>
                            <p>An organization dedicated to writing, teaching, and challenging the next generation of curious learners.</p> 
                            <a href="#about" class="main-button-slider">Latest News</a>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default LandingWelcomeComponent;