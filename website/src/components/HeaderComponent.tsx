import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Cookies from 'universal-cookie'
import { useUserLogin } from 'utils/UserContext'
import { User } from '@prisma/client'
import userValidator from 'utils/UserValidator'
import { trpc } from 'utils/trpc'

const cookies = new Cookies()

const HeaderComponent: React.FC = () => {
    const [user, setUser] = useUserLogin()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const signOutUser = async () => {
        setUser({})
        setIsLoggedIn(false)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    // Set Logged In State
    useEffect(() => {
        const response = userValidator.safeParse(user)

        if (response.success) {
            setIsLoggedIn(true)
        }
    }, [user])

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
                                                onClick={signOutUser}
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
