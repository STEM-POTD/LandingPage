import React, { useRef } from 'react'
import { trpc } from 'utils/trpc'
import { useNavigate } from 'react-router'
import { z } from 'zod'

const RegisterMainComponent = () => {
    return (
        <main className="mt-20 flex h-screen items-center justify-center">
            <div className="h-fit w-fit rounded-xl bg-green-600">
                <div className="mx-24 flex flex-col items-center justify-between">
                    <div className="my-8 text-3xl font-bold">
                        Register New User
                    </div>
                    <RegisterForm />
                </div>
            </div>
        </main>
    )
}

const RegisterForm = () => {
    const navigate = useNavigate()
    const { mutateAsync: register, isLoading: isRegistering } =
        trpc.user.register.useMutation({
            onSuccess: () => {
                alert('Successfully registered user')
                navigate('/')
            },

            onError: (error) => {
                console.log('error: ', error)
                alert(`Error registering user : ${error.message}`)
            },
        })

    return (
        <form
            className="mb-8"
            onSubmit={async (e) => {
                e.preventDefault()

                const formData = new FormData(e.currentTarget)
                const data = Object.fromEntries(formData.entries())

                const registerValidator = z.object({
                    username: z.string(),
                    email: z.string().email({
                        message: 'Invalid email address',
                    }),
                    password: z
                        .string()
                        .min(8, {
                            message: 'Must be 8 or more characters long',
                        })
                        .max(255, {
                            message: 'Must be 255 or fewer characters long',
                        }),
                })

                const registerUser = registerValidator.safeParse(data)

                if (!registerUser.success) {
                    console.log('error: ', registerUser.error)
                    alert(registerUser.error.issues[0].message)
                    return
                }

                const { username, email, password } = registerUser.data

                const newUser = await register({
                    name: username,
                    email,
                    password,
                })

                console.log('newUser: ', newUser)
            }}
        >
            <div className="flex flex-row items-center justify-between">
                <label className="m-2" htmlFor="username">
                    Name
                </label>
                <input
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
                    disabled={isRegistering}
                >
                    {isRegistering ? 'Registering...' : 'Register'}
                </button>
            </div>
        </form>
    )
}
export default RegisterMainComponent
