import { Problem } from '.prisma/client'
import React, { useRef } from 'react'
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
                page.items.map((problem) => (
                    <div className="w-1/3" id={problem.id}>
                        <div className="m-4 w-fit rounded-3xl bg-gradient-to-br from-indigo-500 to-red-400 p-4">
                            <PracticeProblem
                                problem={problem}
                                fetchNextPage={fetchNextPage}
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

const PracticeProblem: React.FC<{
    problem: Problem
    fetchNextPage: ReturnType<
        typeof trpc.getProblemsBySubject.useInfiniteQuery
    >['fetchNextPage']
}> = ({ problem: { title, content }, fetchNextPage }) => {
    
    const buttonRef = useRef<HTMLButtonElement>(null)
    
    return (
        <>
            <h2 className="font-bold">{title}</h2>
            <p>{content}</p>
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
                    ref={buttonRef}
                    type="submit"
                    className="inline-flex items-center rounded-l-md px-3 text-sm"
                    onClick={(e) => {
                        e.preventDefault()
                        fetchNextPage()
                        buttonRef!.current!.disabled = true
                    }}
                >
                    Submit
                </button>
            </div>
        </>
    )
}

export default PracticeMainComponent
