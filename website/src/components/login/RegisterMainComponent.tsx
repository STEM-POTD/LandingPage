import React, { useRef } from 'react'
import { trpc } from 'utils/trpc'

const RegisterMainComponent = () => {
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)

    const registerUser = trpc.createUser.useMutation()

    return (
        <main className="mt-20 flex h-screen items-center justify-center">
            <div className="h-1/2 w-1/2 rounded-xl bg-green-600">
                <div className="flex h-full flex-col items-center justify-between">
                    <div className="my-8 text-3xl font-bold">
                        Register New User
                    </div>
                    <form
                        className="mb-8"
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (
                                !usernameRef.current ||
                                !passwordRef.current ||
                                !emailRef.current
                            )
                                return
                            try {
                                registerUser.mutateAsync({
                                    name: usernameRef.current.value,
                                    email: emailRef.current.value,
                                    password: passwordRef.current.value,
                                })
                            } catch (error) {
                                console.log({ error })
                                console.log('cookie: ', document.cookie)
                            }
                        }}
                    >
                        <div className="flex flex-row items-center justify-between">
                            <label className="m-2" htmlFor="username">
                                Name
                            </label>
                            <input
                                ref={usernameRef}
                                className="rounded-md text-center"
                                type="text"
                                id="username"
                                name="username"
                                required
                            />
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <label className="m-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                ref={emailRef}
                                className="rounded-md text-center text-sm"
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
                                className="rounded-md text-center text-sm"
                                type="password"
                                id="password"
                                name="password"
                                required
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className=" my-2 rounded-full bg-green-800 p-2 px-4"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default RegisterMainComponent
