import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useUserLogin } from 'utils/UserContext'
import { trpc } from 'utils/trpc'

const HeaderComponent: React.FC = () => {
    const user = useUserLogin()
    const isLoggedIn = user !== null

    const { mutateAsync: signOutUser } = trpc.authed.logout.useMutation()

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
                                {!isLoggedIn ? (
                                    <>
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
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <a
                                                id={'practice'}
                                                href="/practice"
                                                className={`menu-item`}
                                            >
                                                Start Practicing
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                id={'signOut'}
                                                href="/"
                                                onClick={() => signOutUser()}
                                                className={`menu-item`}
                                            >
                                                Sign Out
                                            </a>
                                        </li>
                                    </>
                                )}
                                <li>
                                    <a
                                        id={'leaderboard'}
                                        href="/leaderboard"
                                        className={`menu-item`}
                                    >
                                        Leaderboard
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
