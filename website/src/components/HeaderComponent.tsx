import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

const HeaderComponent: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState(
        document.cookie.match('/^(.*;)?s*logged_ins*=s*[^;]+(.*)?$/')?.pop() ===
            'true'
    )

    return (
        <header className="header-area header-sticky sticky top-0">
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
                                        href="/#welcome"
                                        className={`menu-item`}
                                    >
                                        Home
                                    </a>
                                </li>
                                <li className="scroll-to-section">
                                    <a
                                        id={'news'}
                                        href="/#about"
                                        className={`menu-item`}
                                    >
                                        News
                                    </a>
                                </li>
                                <li className="scroll-to-section">
                                    <a
                                        id={'team'}
                                        href="/#testimonials"
                                        className={`menu-item`}
                                    >
                                        Team
                                    </a>
                                </li>
                                <li className="scroll-to-section">
                                    <a
                                        id={'login'}
                                        href="/login"
                                        className={`menu-item`}
                                    >
                                        Sign In
                                    </a>
                                </li>
                                <li className="scroll-to-section">
                                    <a
                                        id={'register'}
                                        href="/register"
                                        className={`menu-item`}
                                    >
                                        Register User
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={'practice'}
                                        href="/practice"
                                        className={`menu-item`}
                                    >
                                        Start Practicing
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
