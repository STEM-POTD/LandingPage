import { Problem } from '.prisma/client'
import React from 'react'
import { trpc } from 'utils/trpc'

const PracticeMainComponent = () => {
    const {
        data: problems,
        isFetching,
        isLoading,
    } = trpc.getProblemsBySubject.useQuery({ subject: 'math' })
    return (
        <div className="mt-24">
            <h1 className="text-3xl font-bold p-4 m-4 text-center">
                Practice Problems
            </h1>
            {isLoading && <p>Loading...</p>}
            {problems &&
                problems.map((problem) => (
                    <div className="w-1/3" id={problem.id}>
                        <PracticeProblem
                            id={problem.id}
                            title={problem.title}
                            content={problem.content}
                        />
                    </div>
                ))}
        </div>
    )
}

const PracticeProblem: React.FC<Problem> = ({ title, content }) => {
    return (
        <div className="rounded-3xl w-fit p-4 m-4 bg-gradient-to-br from-indigo-500 to-red-400">
            <h2 className="font-bold">{title}</h2>
            <p>{content}</p>
            <label htmlFor='answer' className='mt-4 font-bold'>Answer</label>
            <div className="flex rounded-md">
                <input type="text" name="company-website" id="company-website" className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-center sm:text-sm" placeholder="www.example.com" />
                <button type='submit' className="inline-flex items-center rounded-l-md px-3 text-sm">Submit</button>
            </div>
        </div>
    )
}
export default PracticeMainComponent
