import { User } from '@prisma/client'
import React, { createContext, useContext, useEffect } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import { trpc } from './trpc'

type UserContextType = { user: User; loggedIn: true } | { loggedIn: false }

const useUserData = () => {
    const { data, isSuccess, isError, isLoading } =
        trpc.user.authed.authedUser.useQuery(undefined, {
            retry: false,
        })

    return {
        user: data?.user,
        isError,
        isSuccess,
        isLoading,
    }
}

const UserContext = createContext<UserContextType>({ loggedIn: false })

export const useUserLogin = () => {
    return useContext(UserContext)
}

export const UserProvider: React.FC<{ children: JSX.Element[] }> = ({
    children,
}) => {
    const { user, isSuccess } = useUserData()

    const res: UserContextType =
        isSuccess && user ? { user, loggedIn: true } : { loggedIn: false }

    return <UserContext.Provider value={res}>{children}</UserContext.Provider>
}

export const PrivateRoute = () => {
    const { isLoading, isError } = useUserData()

    return !isLoading && isError ? (
        <Navigate to={'/login'} state={{ from: window.location.pathname }} />
    ) : (
        <Outlet />
    )
}
