import React, { useRef } from 'react'
import { trpc } from 'utils/trpc'
import { z } from 'zod'

const RegisterMainComponent = () => {
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)

    const registerUser = trpc.createUser.useMutation()

    return (
        <main className="mt-20 flex h-screen items-center justify-center">
            <div className="h-fit w-fit rounded-xl bg-green-600">
                <div className="mx-24 flex flex-col items-center justify-between">
                    <div className="my-8 text-3xl font-bold">
                        Register New User
                    </div>
                    <form
                        className="mb-8"
                        onSubmit={async (e) => {
                            e.preventDefault()

                            const registerValidator = z.object({
                                name: z.string(),
                                email: z.string().email({
                                    message: 'Invalid email address',
                                }),
                                password: z
                                    .string()
                                    .min(8, {
                                        message:
                                            'Must be 8 or more characters long',
                                    })
                                    .max(255, {
                                        message:
                                            'Must be 255 or fewer characters long',
                                    }),
                            })

                            const register = registerValidator.safeParse({
                                name: usernameRef.current?.value,
                                email: emailRef.current?.value,
                                password: passwordRef.current?.value,
                            })

                            if (!register.success) {
                                console.log('error: ', register.error)
                                alert(register.error.issues[0].message)
                                usernameRef.current!.value = ''
                                emailRef.current!.value = ''
                                passwordRef.current!.value = ''
                                return
                            }

                            const { name, email, password } = register.data

                            const newUser = await registerUser.mutateAsync({
                                name,
                                email,
                                password,
                            })

                            if (registerUser.isError) {
                                console.log('error: ', newUser)
                                alert(registerUser.error.message)
                            }

                            console.log('newUser: ', newUser)
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
