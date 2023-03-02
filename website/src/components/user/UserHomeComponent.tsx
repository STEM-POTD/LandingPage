import React from 'react'
import { trpc } from 'utils/trpc'
import { useUserLogin } from 'utils/UserContext'
import { z } from 'zod'

export const UserHomeComponent: React.FC = () => {
    const userState = useUserLogin()
    const { name, email } = userState.loggedIn
        ? userState.user
        : { name: '', email: '' }

    return (
        <div className="mt-24">
            <h1>Welcome {name}!</h1>
            <h2>Your email is {email}</h2>
            <UpdateUserForm />
        </div>
    )
}

const NewTeamButton: React.FC = () => {
    const {
        mutateAsync: createTeam,
        isLoading,
        isSuccess,
        isIdle,
    } = trpc.team.create.useMutation()

    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    createTeam({
                        name: 'New Team',
                    })
                }}
            >
                Create New Team
            </button>
            {!isIdle && !isLoading && isSuccess && (
                <div className="mt-4">Successfully created team</div>
            )}
            {!isIdle && !isLoading && !isSuccess && (
                <div className="mt-4">Failed to create team</div>
            )}
            {isLoading && <div className="mt-4">Creating team...</div>}
        </div>
    )
}

const UpdateUserForm = () => {
    const {
        mutateAsync: updateUser,
        isLoading,
        isSuccess,
        isIdle,
    } = trpc.user.authed.update.useMutation()

    return (
        <>
            <form
                className="flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault()

                    const data = new Map(new FormData(e.currentTarget))

                    data.forEach((value, key) => {
                        if (value === '') {
                            data.delete(key)
                        }
                    })

                    console.log('data: ', data)

                    const updateUserValidator = z.object({
                        name: z.string().optional(),
                        email: z
                            .string()
                            .email({
                                message: 'Invalid email address',
                            })
                            .optional(),
                        password: z
                            .string()
                            .min(8, {
                                message: 'Must be 8 or more characters long',
                            })
                            .max(255, {
                                message: 'Must be 255 or fewer characters long',
                            })
                            .optional(),
                    })

                    const update = updateUserValidator.safeParse(
                        Object.fromEntries(data.entries())
                    )

                    if (!update.success) {
                        console.log('error: ', update.error)
                        alert(update.error.issues[0].message)
                        e.currentTarget.reset()
                        return
                    }
                    e.currentTarget.reset()

                    const updatedUser = updateUser(update.data)
                    console.log('updatedUser: ', updatedUser)
                }}
            >
                <div>
                    <label className="mr-4 mt-2" htmlFor="username">
                        Change Username:{' '}
                    </label>
                    <input id="username" name="username" />
                </div>

                <div>
                    <label className="mr-4 mt-2" htmlFor="password">
                        Change Password:{' '}
                    </label>
                    <input id="password" name="password" />
                </div>

                <div>
                    <label className="mr-4 mt-2" htmlFor="email">
                        Change Email:{' '}
                    </label>
                    <input id="email" name="email" />
                </div>

                <button type="submit">Update</button>
            </form>

            {!isIdle && !isLoading && isSuccess && (
                <div className="mt-4">Successfully updated user</div>
            )}
            {!isIdle && !isLoading && !isSuccess && (
                <div className="mt-4">Failed to update user</div>
            )}
            {isLoading && <div className="mt-4">Updating user...</div>}
        </>
    )
}
