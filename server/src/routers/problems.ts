import { z } from 'zod'
import { router } from '../utils/trpc'
import { authedProcedure } from './user'

export const problemsRouter = router({
    getProblems: authedProcedure
        .query(async ({ ctx }) => {

            // Get all the problems that the user has not solved
            const problems = await ctx.prisma.problem.findMany({
                orderBy: { id: 'asc' },
                where: {
                    NOT: {
                        solvedBy: {
                            some: {
                                id: ctx.user.id,
                            },
                        },
                    },
                },
            })

            return problems
        }),
})
