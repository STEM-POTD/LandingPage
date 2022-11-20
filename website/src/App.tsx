import React, { useState } from 'react'
import LandingMainComponent from './components/landing/LandingMainComponent'
import HeaderComponent from './components/HeaderComponent'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/templatemo-lava.css'
import FooterComponent from 'components/FooterComponent'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from 'utils/trpc'
import { httpBatchLink } from '@trpc/client'
import { createReactRouter, createRouteConfig, Outlet, RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import PracticeMainComponent from 'components/practice/PracticeMainComponent'

const queryClient = new QueryClient()

const rootRoute = createRouteConfig()

const indexRoute = rootRoute.createRoute({
  path: '/',
  component: LandingMainComponent,
})

const practiceProblemsRoute = rootRoute.createRoute({
  path: '/practice',
  component: PracticeMainComponent,
})

const routeConfig = rootRoute.addChildren([
  indexRoute,
  practiceProblemsRoute,
])

// Set up a ReactRouter instance
const router = createReactRouter({
  routeConfig,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface RegisterRouter {
    router: typeof router
  }
}

function App() {
    const [trpcClient] = useState(() => trpc.createClient({
        links: [
            httpBatchLink({
                url: 'http://localhost:8080/api/trpc',
            }),
        ]
    }))    

    return (
        <>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router}>
                        <HeaderComponent />
                        <Outlet /> {/* Start rendering router matches */}
                        <TanStackRouterDevtools position="bottom-left" />
                        <FooterComponent />
                    </RouterProvider>
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
                </QueryClientProvider>
            </trpc.Provider>
        </>
    )
}

export default App
