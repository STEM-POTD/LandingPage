import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { trpc } from 'utils/trpc'
import { useUserLogin } from 'utils/UserContext'
import { z } from 'zod'

export const UserHomeComponent: React.FC = () => {
    const userState = useUserLogin()
    const navigate = useNavigate()

    if (!userState.loggedIn) {
        navigate('/login')
        return null
    }

    const { id, name, email } = userState.user
    const { data } = trpc.team.byId.useQuery({ id })
    const {
        mutate: leaveTeam,
        isLoading,
        isError,
        isSuccess,
        isIdle,
    } = trpc.team.leave.useMutation({
        onSuccess: () => window.location.reload(),
    })
    const [shareText, setShareText] = useState('Copy Team ID')
    const [showNewTeam, setShowNewTeam] = useState(false)

    return (
        <div className="mt-24 mx-4">
            <h1>Welcome {name}!</h1>
            <h2>Your email is {email}</h2>
            <UpdateUserForm />

            {data && data.team ? (
                <div>
                    <h2>Your team is {data.team.name}</h2>
                    <h3>Team members:</h3>
                    <ul>
                        {data.team.members.map(({ id, name }) => (
                            <li key={id}>{name}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <>
                    <button
                        className="transition ease-in-out mt-4 mx-4 hover:bg-blue-700 font-bold py-2 px-4 rounded-2xl"
                        type="button"
                        onClick={() => setShowNewTeam(true)}
                    >
                        Create New Team
                    </button>
                    <JoinTeamComponent />
                </>
            )}

            {data && data.team && (
                <button
                    type="button"
                    onClick={() => {
                        navigator.clipboard.writeText(data.team.id)
                        setShareText('Copied!')
                    }}
                    className="transition ease-in-out mt-4 mx-4 hover:bg-blue-700 font-bold py-2 px-4 rounded-2xl"
                >
                    {shareText}
                </button>
            )}

            <NewTeamModal
                visible={showNewTeam}
                hide={() => setShowNewTeam(false)}
            />

            {data && data.team && (
                <>
                    <button
                        type="button"
                        onClick={() => {
                            leaveTeam({ teamId: data.team.id })
                        }}
                        className="transition ease-in-out mt-4 mx-4 hover:bg-red-500 font-bold py-2 px-4 rounded-2xl"
                    >
                        {(isIdle || isError) && 'Leave'}{' '}
                        {isLoading && <div>Leaving...</div>}
                        {isSuccess && <div>Left!</div>}
                    </button>
                    {isError && <div>Failed to leave team</div>}
                </>
            )}
        </div>
    )
}

const JoinTeamComponent = () => {
    const [teamId, setTeamId] = useState('')
    const {
        mutateAsync: joinTeam,
        isLoading,
        isSuccess,
        isIdle,
        isError,
    } = trpc.team.join.useMutation({
        onSuccess: () => window.location.reload(),
    })

    return (
        <>
            <div>You are not in a team</div>
            <form className="flex space-x-2 px-2">
                <input
                    type="text"
                    value={teamId}
                    placeholder="Team ID"
                    onChange={(e) => setTeamId(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => {
                        if (!teamId) return
                        joinTeam({ teamId })
                    }}
                >
                    {(isIdle || isError) && 'Join'}
                    {isLoading && <div>Joining...</div>}
                    {isSuccess && <div>Joined!</div>}
                </button>
            </form>

            {isError && <div className="mt-4">Failed to join team</div>}
        </>
    )
}

const NewTeamModal: React.FC<{ visible: boolean; hide: () => void }> = ({
    visible,
    hide,
}) => {
    const {
        mutateAsync: createTeam,
        isLoading,
        isSuccess,
        isIdle,
    } = trpc.team.create.useMutation()

    const [teamName, setTeamName] = useState('')

    return (
        <section
            className={`${
                visible ? 'visible' : 'invisible'
            } bg-blur fixed top-0 left-0 h-screen w-screen backdrop-blur`}
        >
            <div className="flex h-full items-center justify-center space-x-2">
                <input
                    type="text"
                    value={teamName}
                    placeholder="Team Name"
                    onChange={(e) => setTeamName(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => {
                        if (!teamName) return
                        createTeam({
                            name: teamName,
                        })
                    }}
                >
                    Create
                </button>
                <button
                    type="button"
                    onClick={() => {
                        hide()
                        setTeamName('')
                    }}
                >
                    Cancel
                </button>
            </div>
            {!isIdle && !isLoading && isSuccess && (
                <div className="mt-4">Successfully created team</div>
            )}
            {!isIdle && !isLoading && !isSuccess && (
                <div className="mt-4">Failed to create team</div>
            )}
            {isLoading && <div className="mt-4">Creating team...</div>}
        </section>
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
                    if (Object.keys(update.data).length === 0) return
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
