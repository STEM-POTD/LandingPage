import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useUserLogin } from 'utils/UserContext'
import { trpc } from 'utils/trpc'
import { Link, NavLink } from 'react-router-dom'

const HeaderComponent: React.FC = () => {
    const { loggedIn } = useUserLogin()

    const { mutateAsync: signOutUser } = trpc.user.authed.logout.useMutation()

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
                                {!loggedIn ? (
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

const NewHeaderComponent: React.FC = () => {
    const { loggedIn } = useUserLogin()

    const { mutateAsync: signOutUser } = trpc.user.authed.logout.useMutation()

    return (
        <header className="bg-nav-yellow fixed top-0 z-50 flex h-20 w-full items-center justify-center">
            <a href="/" className="absolute left-0 mx-4 text-3xl font-black">
                STEM POTD
            </a>
            <nav className="flex h-full w-full items-center justify-center">
                <div className="flex space-x-4 font-light">
                    <NavLink id={'home'} to="/" end>
                        Home
                    </NavLink>
                    <Link id={'news'} to="/news">
                        News
                    </Link>
                    <NavLink id={'team'} to="/team">
                        Team
                    </NavLink>

                    {!loggedIn ? (
                        <>
                            <NavLink id={'login'} to="/login">
                                Sign In
                            </NavLink>

                            <NavLink
                                id={'register'}
                                to="/register"
                                className={`menu-item`}
                            >
                                Register User
                            </NavLink>
                            <NavLink
                                id={'leaderboard'}
                                to="/leaderboard"
                                className={`menu-item`}
                            >
                                Leaderboard
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink
                                id={'dashboard'}
                                to="/authed/user"
                                className={`menu-item`}
                            >
                                Dashboard
                            </NavLink>
                            <button
                                type="button"
                                id={'signOut'}
                                onClick={() => {
                                    signOutUser()
                                    window.location.reload()
                                }}
                                className={`menu-item`}
                            >
                                Sign Out
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default NewHeaderComponent
