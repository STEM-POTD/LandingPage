import React, { useState } from 'react'
import HeaderComponent from './components/HeaderComponent'
import 'bootstrap/dist/css/bootstrap.min.css'
import FooterComponent from 'components/FooterComponent'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { token, trpc } from 'utils/trpc'
import { httpBatchLink } from '@trpc/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingMainComponent from 'components/landing/LandingMainComponent'
import PracticeMainComponent from 'components/practice/PracticeMainComponent'
import { MathJaxContext } from 'better-react-mathjax'
import LeaderboardMainComponent from 'components/leaderboard/LeaderboardMainComponent'
import RegisterMainComponent from 'components/login/RegisterMainComponent'
import LoginMainComponent from 'components/login/LoginMainComponent'
import { UserProvider } from 'utils/UserContext'
import { UserHomeComponent } from 'components/user/UserHomeComponent'

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingMainComponent />,
    },
    {
        path: '/practice',
        element: <PracticeMainComponent />,
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
        element: <UserHomeComponent />,
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
                            Authorization: token,
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
                    <UserProvider>
                        <QueryClientProvider client={queryClient}>
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
                        </QueryClientProvider>
                    </UserProvider>
                </trpc.Provider>
            </MathJaxContext>
        </>
    )
}

export default App
