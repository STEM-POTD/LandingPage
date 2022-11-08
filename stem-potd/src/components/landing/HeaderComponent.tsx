import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const HeaderComponent: React.FC = () => {
    type activeElem = 'home' | 'news' | 'team' | 'login'

    const [active, setActive] = useState<activeElem>('home')

    return (
        <header className="header-area header-sticky">
            <Container>
                <Row>
                    <Col xs={12}>
                        <nav className="main-nav">
                            <a href="/LandingPage" className="logo">
                                STEM POTD
                            </a>
                            <ul className="nav">
                                <li className="scroll-to-section">
                                    <a
                                        id={'home'}
                                        href="#welcome"
                                        className={`menu-item`}
                                    >
                                        Home
                                    </a>
                                </li>
                                <li className="scroll-to-section">
                                    <a
                                        id={'news'}
                                        href="#about"
                                        className={`menu-item`}
                                    >
                                        News
                                    </a>
                                </li>
                                <li className="scroll-to-section">
                                    <a
                                        id={'team'}
                                        href="#testimonials"
                                        className={`menu-item`}
                                    >
                                        Team
                                    </a>
                                </li>
                                <li className="scroll-to-section">
                                    <a
                                        id={'login'}
                                        href="/signin"
                                        className={`menu-item`}
                                    >
                                        Sign In
                                    </a>
                                </li>
                            </ul>
                            <a className="menu-trigger">
                                <span>Menu</span>
                            </a>
                        </nav>
                    </Col>
                </Row>
            </Container>
        </header>
    )
}

export default HeaderComponent
