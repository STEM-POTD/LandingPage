import React from 'react'
import { trpc } from 'utils/trpc'

const LeaderboardMainComponent = () => {
    const {
        isError,
        error,
        data: users,
        isLoading,
    } = trpc.user.allByScore.useQuery()

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error: {error.message}</p>

    return (
        <main className="mt-20 flex h-screen flex-col items-center">
            <h1 className="m-4 text-center text-3xl font-bold">Leaderboard</h1>
            <table className="h-auto w-1/3 table-fixed text-center">
                <thead className="m-4 p-8">
                    <tr>
                        <th className="m-4">Rank</th>
                        <th className="m-4">Username</th>
                        <th className="m-4">Points</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr className="p-4" key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}

export default LeaderboardMainComponent
