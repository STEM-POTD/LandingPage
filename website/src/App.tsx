import React, { useState } from 'react'
import HeaderComponent from './components/HeaderComponent'
import 'bootstrap/dist/css/bootstrap.min.css'
import FooterComponent from 'components/FooterComponent'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { token, trpc } from 'utils/trpc'
import { getFetch, httpBatchLink } from '@trpc/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import LandingMainComponent from 'components/landing/LandingMainComponent'
import PracticeMainComponent from 'components/practice/PracticeMainComponent'
import { MathJaxContext } from 'better-react-mathjax'
import LeaderboardMainComponent from 'components/leaderboard/LeaderboardMainComponent'
import RegisterMainComponent from 'components/login/RegisterMainComponent'
import LoginMainComponent from 'components/login/LoginMainComponent'
import { UserProvider, useUserLogin } from 'utils/UserContext'
import { UserHomeComponent } from 'components/user/UserHomeComponent'
import superjson from 'superjson'

const queryClient = new QueryClient()

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const [globalUser] = useUserLogin()

    return globalUser ? (
        children
    ) : (
        <Navigate
            to={'/login'}
            state={{ from: window.location.pathname }}
            replace
        />
    )
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingMainComponent />,
    },
    {
        path: '/practice',
        element: (
            <PrivateRoute>
                <PracticeMainComponent />
            </PrivateRoute>
        ),
    },
    {
        path: '/leaderboard',
        element: <LeaderboardMainComponent />,
    },
    {
        path: '/login',
        element: <LoginMainComponent />,
    },
    {
        path: '/register',
        element: <RegisterMainComponent />,
    },
    {
        path: '/leaderboard',
        element: <LeaderboardMainComponent />,
    },
    {
        path: '/user',
        element: (
            <PrivateRoute>
                <UserHomeComponent />
            </PrivateRoute>
        ),
    },
])

const config = {
    loader: { load: ['[tex]/html'] },
    tex: {
        packages: { '[+]': ['html'] },
        inlineMath: [
            ['$', '$'],
            ['\\(', '\\)'],
        ],
        displayMath: [
            ['$$', '$$'],
            ['\\[', '\\]'],
        ],
    },
}

function App() {
    const [trpcClient] = useState(() =>
        trpc.createClient({
            transformer: superjson,
            links: [
                httpBatchLink({
                    url: 'http://localhost:8080/api/trpc',
                    fetch(url, options) {
                        return fetch(url, {
                            ...options,
                            credentials: 'include',
                        })
                    },
                    headers() {
                        return {
                            authorization: token,
                        }
                    },
                }),
            ],
        })
    )

    return (
        <>
            <MathJaxContext version={3} config={config}>
                <trpc.Provider client={trpcClient} queryClient={queryClient}>
                    <QueryClientProvider client={queryClient}>
                        <UserProvider>
                            <HeaderComponent />
                            <RouterProvider router={router} />
                            <ReactQueryDevtools
                                initialIsOpen
                                position="bottom-left"
                                toggleButtonProps={{
                                    style: {
                                        marginLeft: '5.5rem',
                                        transform: `scale(.7)`,
                                        transformOrigin: 'bottom left',
                                    },
                                }}
                            />
                            <FooterComponent />
                        </UserProvider>
                    </QueryClientProvider>
                </trpc.Provider>
            </MathJaxContext>
        </>
    )
}

export default App
