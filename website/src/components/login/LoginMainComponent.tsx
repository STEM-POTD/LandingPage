import React from 'react'
import { useNavigate } from 'react-router'
import { trpc } from 'utils/trpc'
import { z } from 'zod'

const LoginMainComponent = () => {
    return (
        <main className="mt-20 flex h-screen items-center justify-center">
            <div className="h-fit w-fit rounded-xl bg-green-600">
                <div className="mx-24 flex flex-col items-center justify-between">
                    <div className="my-8 text-3xl font-bold">Login</div>
                    <LoginForm />
                </div>
            </div>
        </main>
    )
}

const LoginForm = () => {
    const navigate = useNavigate()

    const signIn = trpc.user.login.useMutation({
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

        const data = new FormData(e.currentTarget)
        const dataObj = Object.fromEntries(data.entries())

        const loginValidator = z.object({
            email: z.string().email({ message: 'Invalid email address' }),
            password: z
                .string()
                .min(8, { message: 'Must be 8 or more characters long' })
                .max(255, { message: 'Must be 255 or fewer characters long' }),
        })

        const login = loginValidator.safeParse({
            email: dataObj.email,
            password: dataObj.password,
        })

        if (!login.success) {
            console.log('error: ', login.error)
            alert(login.error.issues[0].message)
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

        alert('Login successful')

        navigate('/')
        window.location.reload()
    }

    return (
        <form className="mb-8" onSubmit={signInUser}>
            <div className="flex flex-row items-center justify-between">
                <label className="m-2" htmlFor="email">
                    Email
                </label>
                <input
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
    )
}

export default LoginMainComponent
