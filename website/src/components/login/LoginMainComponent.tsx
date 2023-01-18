import React, { useRef } from 'react'
import { trpc } from 'utils/trpc'

const LoginMainComponent = () => {
    const passwordRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)

    console.log(
        'cookie: ',
        document.cookie
    )
    const signIn = trpc.signInUser.useMutation({
        onSuccess({ accessToken }) {
            document.cookie = `token=${accessToken}`
        }
    })
    
    const signInUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('submit')
        
        const res = await signIn.mutateAsync({
            email: emailRef!.current!.value,
            password: passwordRef!.current!.value,
        })

        if (signIn.isError) console.log('error: ', res)

        localStorage.setItem('user', JSON.stringify(res.user))
        console.log('user', localStorage.getItem('user'))
    }
    
    return (
        <main className="mt-20 flex h-screen items-center justify-center">
            <div className="h-1/2 w-1/2 rounded-xl bg-green-600">
                <div className="flex h-full flex-col items-center justify-between">
                    <div className="my-8 text-3xl font-bold">Login</div>
                    <form
                        className="mb-8"
                        onSubmit={signInUser}
                    >
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
                    <button type='button' onClick={(e) => {
                        e.preventDefault()
                    }}>
                        button!
                    </button>
                </div>
            </div>
        </main>
    )
}

export default LoginMainComponent
