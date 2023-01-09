import React from 'react'
import { trpc } from 'utils/trpc'

const LeaderboardMainComponent = () => {
    const {
        isError,
        error,
        data: users,
        isLoading,
    } = trpc.getUsersByScore.useQuery()

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error: {error.message}</p>

    return (
        <div>
            <h1>Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default LeaderboardMainComponent
