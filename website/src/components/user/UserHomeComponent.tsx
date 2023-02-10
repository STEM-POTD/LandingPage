import React from 'react'
import { trpc } from 'utils/trpc'
import { useUserLogin } from 'utils/UserContext'
import { z } from 'zod'

export const UserHomeComponent: React.FC = () => {
    const [user] = useUserLogin()
    const { id, name, email, password } = user!

    const usernameRef = React.useRef<HTMLInputElement>(null)
    const passwordRef = React.useRef<HTMLInputElement>(null)
    const emailRef = React.useRef<HTMLInputElement>(null)

    const {
        mutateAsync: updateUser,
        isLoading,
        isSuccess,
        isIdle,
    } = trpc.updateUser.useMutation()

    return (
        <div className="mt-24">
            <h1>Welcome {name}!</h1>
            <h2>Your email is {email}</h2>

            <form
                className="flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault()

                    const updateUserValidator = z.object({
                        name: z.string().optional(),
                        email: z
                            .string()
                            .email({
                                message: 'Invalid email address',
                            })
                            .or(z.string().length(0))
                            .optional(),
                        password: z
                            .string()
                            .min(8, {
                                message: 'Must be 8 or more characters long',
                            })
                            .max(255, {
                                message: 'Must be 255 or fewer characters long',
                            })
                            .or(z.string().length(0))
                            .optional(),
                    })

                    const update = updateUserValidator.safeParse({
                        name: usernameRef.current?.value,
                        email: emailRef.current?.value,
                        password: passwordRef.current?.value,
                    })

                    if (!update.success) {
                        console.log('error: ', update.error)
                        alert(update.error.issues[0].message)
                        if (
                            usernameRef.current &&
                            emailRef.current &&
                            passwordRef.current
                        ) {
                            usernameRef.current.value = ''
                            emailRef.current.value = ''
                            passwordRef.current.value = ''
                        }
                        return
                    }

                    const {
                        name: updatedName,
                        email: updatedEmail,
                        password: updatedPassword,
                    } = update.data

                    const updatedUser = updateUser({
                        id,
                        name: updatedName ? updatedName : name,
                        email: updatedEmail ? updatedEmail : email,
                        password: updatedPassword ? updatedPassword : password,
                    })
                    console.log('updatedUser: ', updatedUser)
                }}
            >
                <div>
                    <label className="mr-4 mt-2" htmlFor="username">
                        Change Username:{' '}
                    </label>
                    <input id="username" name="username" ref={usernameRef} />
                </div>

                <div>
                    <label className="mr-4 mt-2" htmlFor="password">
                        Change Password:{' '}
                    </label>
                    <input id="password" name="password" ref={passwordRef} />
                </div>

                <div>
                    <label className="mr-4 mt-2" htmlFor="email">
                        Change Email:{' '}
                    </label>
                    <input id="email" name="email" ref={emailRef} />
                </div>

                <button type="submit">Update</button>
            </form>
            {!isIdle && !isLoading && isSuccess && (
                <div className="mt-4">Successfully updated user</div>
            )}
            {isLoading && <div className="mt-4">Updating user...</div>}
        </div>
    )
}
