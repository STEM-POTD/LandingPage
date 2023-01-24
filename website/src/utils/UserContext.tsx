import { User } from '@prisma/client'
import React, { useState, createContext, useContext } from 'react'

const UserContext = createContext<
    [user: User | null, setUser: (user: User | null) => void]
>([null, (prev) => prev])

export const useUserLogin = () => {
    return useContext(UserContext)
}

export const UserProvider: React.FC<{ children: JSX.Element }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null)

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    )
}
