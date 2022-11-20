import React from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const LandingWelcomeComponent: React.FC = () => {
    return (
        <div className="welcome-area" id="welcome">
            <div className="header-text">
                <Container>
                    <Row>
                        <Col
                            className="left-text"
                            lg={6}
                            md={12}
                            sm={12}
                            xs={12}
                        >
                            <h1>
                                STEM <em>POTD</em>
                            </h1>
                            <p>
                                An organization dedicated to writing, teaching,
                                and challenging the next generation of curious
                                learners.
                            </p>
                            <a href="#about" className="main-button">
                                Latest News
                            </a>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default LandingWelcomeComponent
