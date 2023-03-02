import { Problem } from '.prisma/client'
import MathJax from 'better-react-mathjax/MathJax'
import React, { useEffect, useRef, useState } from 'react'
import { trpc } from 'utils/trpc'
import { z } from 'zod'

const PracticeMainComponent = () => {
    const { data: problems, isLoading } = trpc.problems.getProblems.useQuery()

    const { mutate: solve } = trpc.user.authed.solveProblem.useMutation()

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
            {randomOrderedProblems.length === 0 && (
                <div className="flex w-full flex-row justify-center ">
                    <p className="w-1/3 text-center text-xl font-medium">
                        No problems found! Either you've solved all of them or
                        there aren't any left to solve. Check back later!
                    </p>
                </div>
            )}
            {randomOrderedProblems.slice(0, visibileIndex).map((problem) => (
                <div className="w-1/3" id={problem.id}>
                    <div className="m-4 w-fit rounded-3xl">
                        <PracticeProblem
                            problem={problem}
                            onCorrect={() => {
                                setVisibleIndex((prev) => prev + 1)
                                solve({
                                    problemId: problem.id,
                                })
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

const PracticeProblem: React.FC<{
    problem: Problem
    onCorrect: () => void
}> = ({ problem: { title, content, answer: correctAnswer }, onCorrect }) => {
    const answerState = {
        CORRECT: 'bg-green-500',
        INCORRECT: 'bg-red-500',
        UNANSWERED: 'bg-gradient-to-br from-indigo-500 to-red-400',
    } as const

    type AnswerState = (typeof answerState)[keyof typeof answerState]

    const [answeredState, setAnsweredState] = useState<AnswerState>(
        answerState.UNANSWERED
    )

    const handleAnswer = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const dataObj = Object.fromEntries(data.entries())
        const answerSchema = z.object({
            answer: z.string(),
        })
        const answer = answerSchema.safeParse(dataObj)
        if (!answer.success) {
            console.log('error: ', answer.error)
            alert(answer.error.issues[0].message)
            return
        }

        const { answer: answerString } = answer.data

        if (answerString !== correctAnswer) {
            console.log('incorrect')
            setAnsweredState(answerState.INCORRECT)
            return
        }

        console.log('correct')
        setAnsweredState(answerState.CORRECT)
        onCorrect()
    }

    return (
        <>
            <div
                className={`rounded-3xl bg-gradient-to-br ${answeredState} p-4`}
            >
                {/* <div className="rounded-3xl bg-red-500 p-4"> */}
                <h2 className="font-bold">{title}</h2>
                <MathJax>{content}</MathJax>
                <label htmlFor="answer" className="mt-4 font-bold">
                    Answer
                </label>
                <form className="flex rounded-md" onSubmit={handleAnswer}>
                    <input
                        type="text"
                        name="answer"
                        id="answer"
                        className="block w-full flex-1 rounded-md border-gray-300 text-center focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        autoFocus
                        disabled={answeredState === answerState.CORRECT}
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center rounded-l-md px-3 text-sm"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    )
}

export default PracticeMainComponent
