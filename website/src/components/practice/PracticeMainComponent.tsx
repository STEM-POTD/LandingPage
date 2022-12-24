import { Problem } from '.prisma/client'
import React from 'react'
import { trpc } from 'utils/trpc'

const PracticeMainComponent = () => {
    const {
        data: problems,
        isLoading,
        fetchNextPage,
    } = trpc.getProblemsBySubject.useInfiniteQuery(
        {
            limit: 1,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    )
    return (
        <div className="mt-24">
            <h1 className="m-4 p-4 text-center text-3xl font-bold">
                Practice Problems
            </h1>
            {isLoading && <p>Loading...</p>}
            {problems?.pages.map((page) =>
                page?.items?.map((problem) => (
                    <div className="w-1/3" id={problem.id}>
                        <div className="m-4 w-fit rounded-3xl bg-gradient-to-br from-indigo-500 to-red-400 p-4">
                            <PracticeProblem
                                id={problem.id}
                                title={problem.title}
                                content={problem.content}
                            />
                            <label htmlFor="answer" className="mt-4 font-bold">
                                Answer
                            </label>
                            <div className="flex rounded-md">
                                <input
                                    type="text"
                                    name="company-website"
                                    id="company-website"
                                    className="block w-full flex-1 rounded-md border-gray-300 text-center focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="www.example.com"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center rounded-l-md px-3 text-sm"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        console.log(fetchNextPage())
                                        console.log('Fetching next page...')
                                    }}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

const PracticeProblem: React.FC<Problem> = ({ title, content }) => {
    return (
        <>
            <h2 className="font-bold">{title}</h2>
            <p>{content}</p>
        </>
    )
}

export default PracticeMainComponent
