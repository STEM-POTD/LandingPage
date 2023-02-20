import { User } from '@prisma/client'
import React, {
    useState,
    createContext,
    useContext,
    useEffect,
    useCallback,
} from 'react'
import { trpc } from './trpc'
import userValidator from './UserValidator'

const useUserData = () => {
    const { data: responsePayload, isError } = trpc.authed.getUser.useQuery(
        undefined,
        {
            onError: (error) => {
                console.log('error: ', error)
            },
        }
    )

    const utils = trpc.useContext()

    const [user, setUser] = useState<User | Record<string, never>>(
        responsePayload?.data ?? {}
    )

    const { mutate: login } = trpc.update.useMutation({
        onSuccess: (data) => {
            if (data.status === 'error') {
                console.log('error: ', data)
                return
            }

            utils.authed.invalidate()
        },
    })

    const localUser = localStorage.getItem('user')

    const updateUser = useCallback(() => {
        if (localUser !== null) {
            const parsedUser = userValidator.safeParse(JSON.parse(localUser))

            console.log('UserProvider: ', parsedUser)

            if (parsedUser.success) {
                setUser(parsedUser.data)
                console.log(user)

                login({
                    email: parsedUser.data.email,
                    password: parsedUser.data.password,
                })
            }

            console.log('User: ', user)
        }
    }, [localUser])

    useEffect(() => {
        updateUser()
    }, [updateUser])

    return [user, setUser] as const
}

const UserContext = createContext<ReturnType<typeof useUserData>>([
    {},
    (prev) => {
        return prev
    },
])

export const useUserLogin = () => {
    return useContext(UserContext)
}

export const UserProvider: React.FC<{ children: JSX.Element[] }> = ({
    children,
}) => {
    const [user, setUser] = useUserData()

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    )
}
