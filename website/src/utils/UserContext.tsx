import { User } from '@prisma/client'
import { chownSync } from 'fs'
import React, { useState, createContext, useContext } from 'react'
import { trpc } from './trpc'

const useUserData = () => {
    const { data: responsePayload } = trpc.authed.getUser.useQuery()
    return responsePayload?.data ?? null
}

const UserContext = createContext<User | null>(null)

export const useUserLogin = () => {
    return useContext(UserContext)
}

export const UserProvider: React.FC<{ children: JSX.Element[] }> = ({
    children,
}) => {
    const user = useUserData()
    console.log('UserProvider: ', user)

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
