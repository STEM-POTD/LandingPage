import { Problem } from '.prisma/client'
import MathJax from 'better-react-mathjax/MathJax'
import React, {
    SetStateAction,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { trpc } from 'utils/trpc'

const PracticeMainComponent = () => {
    const { data: problems, isLoading } = trpc.getProblems.useQuery()

    console.log({ problems })

    const [randomOrderedProblems, setRandomOrderedProblems] = useState(
        problems ?? []
    )

    const [visibileIndex, setVisibleIndex] = useState(1)

    useEffect(() => {
        setRandomOrderedProblems(
            problems
                ?.map((problem) => ({ problem, random: Math.random() }))
                .sort((a, b) => a.random - b.random)
                .map((item) => item.problem) ?? []
        )
    }, [problems])

    return (
        <div className="mt-24">
            <h1 className="m-4 p-4 text-center text-3xl font-bold">
                Practice Problems
            </h1>
            {isLoading && <p>Loading...</p>}
            {randomOrderedProblems &&
                randomOrderedProblems
                    .slice(0, visibileIndex)
                    .map((problem) => (
                        <div className="w-1/3" id={problem.id}>
                            <div className="m-4 w-fit rounded-3xl bg-gradient-to-br from-indigo-500 to-red-400 p-4">
                                <PracticeProblem
                                    problem={problem}
                                    onClick={() =>
                                        setVisibleIndex((prev) => prev + 1)
                                    }
                                />
                            </div>
                        </div>
                    ))}
        </div>
    )
}

const PracticeProblem: React.FC<{
    problem: Problem
    onClick: () => void
}> = ({ problem: { title, content }, onClick }) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    return (
        <>
            <>
                <h2 className="font-bold">{title}</h2>
                <MathJax>{content}</MathJax>
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
                            onClick()
                            buttonRef.current!.disabled = true
                        }}
                    >
                        Submit
                    </button>
                </div>
            </>
        </>
    )
}

export default PracticeMainComponent
