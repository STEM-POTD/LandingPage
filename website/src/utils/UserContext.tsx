import { User } from '@prisma/client'
import React, { useState, createContext, useContext, useEffect } from 'react'
import userValidator from './UserValidator'

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
    
    if(localStorage.getItem('user') !== null && user === null) {
        const localUser = userValidator.safeParse(
            JSON.parse(localStorage.getItem('user')!)
        )
        
        console.log('UserProvider: ', localUser)

        if (localUser.success) {
            setUser(localUser.data)
        }

        console.log('User: ', user)
    }

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    )
}
