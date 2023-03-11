import React from 'react'
import { useUserLogin } from 'utils/UserContext'
import { trpc } from 'utils/trpc'
import { NavLink, useNavigate } from 'react-router-dom'

const HeaderComponent: React.FC = () => {
    const navigate = useNavigate()
    const { loggedIn } = useUserLogin()

    const { mutateAsync: signOutUser } = trpc.user.authed.logout.useMutation()

    return (
        <header className="bg-nav-yellow fixed top-0 z-50 flex h-20 w-full items-center justify-center">
            <NavLink
                to="/"
                className="absolute left-0 mx-4 text-3xl font-black transition-opacity ease-linear hover:opacity-50"
                end
            >
                STEM POTD
            </NavLink>
            <nav className="flex h-full w-full items-center justify-center">
                <div className="flex space-x-4 font-light">
                    <NavLink
                        className="hover:text-blue-700"
                        id={'home'}
                        to="/"
                        end
                    >
                        Home
                    </NavLink>
                    <NavLink
                        className="hover:text-blue-700"
                        id={'news'}
                        to="/news"
                    >
                        News
                    </NavLink>
                    <NavLink
                        className="hover:text-blue-700"
                        id={'team'}
                        to="/team"
                    >
                        Team
                    </NavLink>

                    {!loggedIn ? (
                        <>
                            <NavLink
                                className="hover:text-blue-700"
                                id={'login'}
                                to="/login"
                            >
                                Sign In
                            </NavLink>

                            <NavLink
                                className="hover:text-blue-700"
                                id={'register'}
                                to="/register"
                            >
                                Register User
                            </NavLink>
                            <NavLink
                                className="hover:text-blue-700"
                                id={'leaderboard'}
                                to="/leaderboard"
                            >
                                Leaderboard
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink
                                className="hover:text-blue-700"
                                id={'dashboard'}
                                to="/authed/user"
                            >
                                Dashboard
                            </NavLink>
                            <button
                                type="button"
                                id={'signOut'}
                                onClick={() => {
                                    signOutUser()
                                    navigate('/login')
                                    window.location.reload()
                                }}
                                className="hover:text-blue-700"
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

export default HeaderComponent
