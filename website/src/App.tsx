import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { token, trpc } from 'utils/trpc'
import { httpBatchLink } from '@trpc/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MathJaxContext } from 'better-react-mathjax'
import superjson from 'superjson'

import { PrivateRoute, UserProvider } from 'utils/UserContext'

import LandingWelcomeComponent from 'components/landing/LandingWelcomeComponent'
import LandingNewsComponent from 'components/landing/LandingNewsComponent'
import LandingTeamComponent from 'components/landing/LandingTeamComponent'
import PracticeMainComponent from 'components/practice/PracticeMainComponent'
import UserHomeComponent from 'components/user/UserHomeComponent'
import LoginMainComponent from 'components/login/LoginMainComponent'
import LeaderboardMainComponent from 'components/leaderboard/LeaderboardMainComponent'
import RegisterMainComponent from 'components/login/RegisterMainComponent'

import RootLayout from 'layouts/RootLayout'

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <LandingWelcomeComponent />,
            },
            {
                path: 'news',
                element: <LandingNewsComponent />,
            },
            {
                path: 'team',
                element: <LandingTeamComponent />,
            },
            {
                path: 'authed',
                element: <PrivateRoute />,
                children: [
                    {
                        path: 'practice',
                        element: <PracticeMainComponent />,
                    },
                    {
                        path: 'user',
                        element: <UserHomeComponent />,
                    },
                ],
            },
            {
                path: 'leaderboard',
                element: <LeaderboardMainComponent />,
            },
            {
                path: 'login',
                element: <LoginMainComponent />,
            },
            {
                path: 'register',
                element: <RegisterMainComponent />,
            },
        ],
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
                        </UserProvider>
                    </QueryClientProvider>
                </trpc.Provider>
            </MathJaxContext>
        </>
    )
}

export default App
