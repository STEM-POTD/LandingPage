import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import image from '@assets/images/features-icon-1.png'

const LandingAboutComponent = () => {
    return (
        <section className="section" id="about">
            <Container>
                <Row>
                    <Col
                        lg={4}
                        md={6}
                        sm={12}
                        xs={12}
                        data-scroll-reveal="enter left move 30px over 0.6s after 0.4s"
                    >
                        <div className="features-item">
                            <h2>01</h2>
                            <img src={image} alt="" />
                            <h4>[Insert Name Here]</h4>
                            <p>
                                STEM POTD's first math competition! Expect
                                cash-prizes, challenging problems, and a great
                                time. Takes place: 11/12/22
                            </p>
                            <a href="#testimonials" className="main-button">
                                Read More
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default LandingAboutComponent
