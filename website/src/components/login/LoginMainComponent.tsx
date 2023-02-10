import React, { useRef } from 'react'
import { useNavigate } from 'react-router'
import { trpc } from 'utils/trpc'
import { useUserLogin } from 'utils/UserContext'
import userValidator from 'utils/UserValidator'
import { z } from 'zod'

const LoginMainComponent = () => {
    const passwordRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)

    const [globalUser, setUser] = useUserLogin()
    const navigate = useNavigate()

    console.log('cookie: ', document.cookie)
    const signIn = trpc.signInUser.useMutation({
        onSuccess(data) {
            if (data.status === 'error') {
                console.log('error: ', data)
                alert(data.error.message)
                return
            }
            const {
                data: { accessToken },
            } = data
            document.cookie = `token=${accessToken}`
        },
    })

    const signInUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('submit')

        const loginValidator = z.object({
            email: z.string().email({ message: 'Invalid email address' }),
            password: z
                .string()
                .min(8, { message: 'Must be 8 or more characters long' })
                .max(255, { message: 'Must be 255 or fewer characters long' }),
        })

        const login = loginValidator.safeParse({
            email: emailRef!.current!.value,
            password: passwordRef!.current!.value,
        })

        if (!login.success) {
            console.log('error: ', login.error)
            alert(login.error.issues[0].message)
            emailRef!.current!.value = ''
            passwordRef!.current!.value = ''
            return
        }

        const { email, password } = login.data

        const res = await signIn.mutateAsync({
            email,
            password,
        })

        if (res.status === 'error') {
            console.log('error: ', res)
            alert(res.error.message)
            return
        }

        const user = userValidator.parse(res.data.user)

        localStorage.setItem('user', JSON.stringify(user))

        setUser(user)

        navigate('/')
        window.location.reload()
    }

    return (
        <main className="mt-20 flex h-screen items-center justify-center">
            <div className="h-fit w-fit rounded-xl bg-green-600">
                <div className="mx-24 flex flex-col items-center justify-between">
                    <div className="my-8 text-3xl font-bold">Login</div>
                    <form className="mb-8" onSubmit={signInUser}>
                        <div className="flex flex-row items-center justify-between">
                            <label className="m-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                ref={emailRef}
                                className="rounded-md text-center"
                                type="text"
                                id="email"
                                name="email"
                                required
                            />
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <label className="m-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                ref={passwordRef}
                                className="rounded-md text-center"
                                type="password"
                                id="password"
                                name="password"
                                required
                                minLength={8}
                                maxLength={255}
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className=" my-2 rounded-full bg-green-800 p-2 px-4"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default LoginMainComponent
